<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Controlador Backend Laravel para Motor SQL de Cross-Selling en Vivo,
 * API Geo-Comercial de Zonas y Productos (`GET /api/analytics/geo-zones`)
 * y Evaluación Táctica del Escudo Antifraude (SentinelCommerce).
 */
final class CommerceAnalyticsController
{
    /**
     * Calcula en SQL qué producto B tiene la mayor correlación histórica de compra conjunta
     * con el producto A y devuelve el descuento de combo del 15% OFF.
     */
    public function crossSellingCorrelation(string $productId): JsonResponse
    {
        $correlated = DB::selectOne(
            <<<'SQL'
            SELECT
                oi_b.product_id AS companion_id,
                p.name AS companion_name,
                p.price AS original_price,
                ROUND(p.price * 0.85, 2) AS discounted_price,
                ROUND(
                    (COUNT(DISTINCT oi_b.order_id) * 100.0) /
                    NULLIF((SELECT COUNT(DISTINCT order_id) FROM order_items WHERE product_id = :sourceId), 0),
                    0
                ) AS co_purchase_rate_percent
            FROM order_items oi_a
            INNER JOIN order_items oi_b
                ON oi_a.order_id = oi_b.order_id
                AND oi_b.product_id <> oi_a.product_id
            INNER JOIN products p
                ON p.id = oi_b.product_id
            WHERE oi_a.product_id = :productId
            GROUP BY oi_b.product_id, p.name, p.price
            ORDER BY co_purchase_rate_percent DESC
            LIMIT 1
            SQL,
            [
                'sourceId' => $productId,
                'productId' => $productId,
            ]
        );

        if ($correlated === null) {
            return new JsonResponse(['offer' => null], 200);
        }

        return new JsonResponse([
            'sourceProductId' => $productId,
            'discountPercent' => 15,
            'discountedPrice' => (float) $correlated->discounted_price,
            'coPurchaseRatePercent' => (int) $correlated->co_purchase_rate_percent,
            'bannerMessage' => sprintf(
                '¡Llevá también %s con 15%% OFF! El %d%% de los usuarios los compran juntos',
                $correlated->companion_name,
                (int) $correlated->co_purchase_rate_percent
            ),
        ]);
    }

    /**
     * Endpoint GET /api/products
     * Retorna el catálogo enriquecido de productos con imágenes reales, rating y correlación.
     */
    public function listProducts(): JsonResponse
    {
        $products = DB::select(
            <<<'SQL'
            SELECT
                p.id,
                p.name,
                p.category,
                p.price,
                p.stock,
                p.rating,
                p.free_shipping AS freeShipping,
                p.protected_purchase AS protectedPurchase,
                p.badge_text AS badgeText,
                p.image_url AS imageUrl,
                p.thumbnail_url AS thumbnailUrl,
                p.correlated_product_id AS correlatedProductId,
                p.co_purchase_rate_percent AS coPurchaseRatePercent
            FROM products p
            ORDER BY p.rating DESC
            SQL
        );

        return new JsonResponse($products, 200);
    }

    /**
     * Endpoint GET /api/analytics/geo-zones
     * Agrupa las órdenes aprobadas por Zona Comercial y determina el Producto Líder,
     * el Combo Asociado y el volumen facturado para alimentar el mapa React-Leaflet.
     */
    public function geoCommercialZones(): JsonResponse
    {
        $zones = DB::select(
            <<<'SQL'
            SELECT
                z.zone_id AS zoneId,
                z.zone_name AS zoneName,
                z.city AS city,
                z.latitude AS lat,
                z.longitude AS lng,
                p_top.name AS topProduct,
                p_top.category AS topCategory,
                p_comp.name AS companionProduct,
                SUM(o.total_amount) AS totalVolume,
                COUNT(DISTINCT o.id) AS ordersCount,
                CASE
                    WHEN SUM(o.total_amount) >= 10000 THEN 'alta'
                    WHEN SUM(o.total_amount) >= 5000 THEN 'media'
                    ELSE 'emergente'
                END AS demandIntensity
            FROM commercial_zones z
            INNER JOIN orders o
                ON o.zone_id = z.zone_id
                AND o.status = 'approved'
            INNER JOIN products p_top
                ON p_top.id = z.lead_product_id
            INNER JOIN products p_comp
                ON p_comp.id = p_top.correlated_product_id
            GROUP BY
                z.zone_id, z.zone_name, z.city, z.latitude, z.longitude,
                p_top.name, p_top.category, p_comp.name
            ORDER BY totalVolume DESC
            SQL
        );

        return new JsonResponse($zones, 200);
    }

    /**
     * Evalúa una transacción entrante del Checkout / Simulador de Identidad
     * y registra la telemetría para SecurityView y MarketingView.
     */
    public function evaluateCheckout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'identityMode' => 'required|in:legitimate,burst_fraudster,anomalous_amount',
            'amount' => 'required|numeric|min:1',
            'itemsCount' => 'required|integer|min:1',
            'crossSellApplied' => 'required|boolean',
        ]);

        $identityMode = (string) $validated['identityMode'];
        $amount = (float) $validated['amount'];

        $riskScore = match ($identityMode) {
            'burst_fraudster' => 94,
            'anomalous_amount' => 86,
            default => 12,
        };

        $status = $riskScore >= 75 ? 'flagged' : 'approved';

        return new JsonResponse([
            'riskScore' => $riskScore,
            'status' => $status,
            'amount' => $amount,
            'evaluatedAt' => now()->toIso8601String(),
        ], 201);
    }
}
