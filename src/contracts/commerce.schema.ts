import { z } from 'zod';

export const ThemeModeSchema = z.enum(['light', 'dark']);
export type ThemeMode = z.infer<typeof ThemeModeSchema>;

export const UserRoleSchema = z.enum(['client', 'admin']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const AuthUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const LoginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export const AdminToolTabSchema = z.enum(['security', 'marketing']);
export type AdminToolTab = z.infer<typeof AdminToolTabSchema>;

export const IdentitySimulationModeSchema = z.enum([
  'legitimate',
  'burst_fraudster',
  'anomalous_amount',
]);
export type IdentitySimulationMode = z.infer<typeof IdentitySimulationModeSchema>;

export const TransactionStatusSchema = z.enum(['approved', 'flagged', 'blocked']);
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;

export const ProductCategorySchema = z.enum([
  'Todos',
  'Hardware & Gaming',
  'Audio Pro',
  'Seguridad & Redes',
  'Accesorios',
]);
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['Hardware & Gaming', 'Audio Pro', 'Seguridad & Redes', 'Accesorios']),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5),
  reviewsCount: z.number().int().nonnegative().default(24),
  condition: z.string().default('Nuevo | +50 vendidos'),
  freeShipping: z.boolean(),
  protectedPurchase: z.boolean(),
  badgeText: z.string().optional(),
  imageUrl: z.string(),
  thumbnailUrl: z.string().optional(),
  correlatedProductId: z.string(),
  coPurchaseRatePercent: z.number().min(1).max(100),
  highlights: z.array(z.string()).default([]),
  galleryImages: z.array(z.string()).default([]),
  installmentsText: z.string().optional(),
});
export type Product = z.infer<typeof ProductSchema>;

export const CrossSellOfferSchema = z.object({
  sourceProductId: z.string(),
  companionProduct: ProductSchema,
  discountPercent: z.literal(15),
  discountedPrice: z.number().positive(),
  coPurchaseRatePercent: z.number().min(1).max(100),
  bannerMessage: z.string(),
});
export type CrossSellOffer = z.infer<typeof CrossSellOfferSchema>;

export const CartItemSchema = z.object({
  product: ProductSchema,
  quantity: z.number().int().positive(),
  isCrossSellBundle: z.boolean(),
  unitPriceApplied: z.number().positive(),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const ForensicReportSchema = z.object({
  transactionId: z.string(),
  executedAt: z.string(),
  confidenceScore: z.number().min(0).max(100),
  attackVector: z.string(),
  triggeredRules: z.array(z.string()),
  velocityPerMinute: z.number().nonnegative(),
  ticketDeviationFactor: z.number().nonnegative(),
  summary: z.string(),
  recommendedAction: z.enum(['block_ip_and_user', 'manual_review', 'approve']),
});
export type ForensicReport = z.infer<typeof ForensicReportSchema>;

export const TransactionRecordSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  customerName: z.string(),
  identityMode: IdentitySimulationModeSchema,
  amount: z.number().positive(),
  itemsCount: z.number().int().positive(),
  crossSellApplied: z.boolean(),
  ipAddress: z.string(),
  city: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  deviceFingerprint: z.string(),
  riskScore: z.number().min(0).max(100),
  status: TransactionStatusSchema,
  forensicReport: ForensicReportSchema.optional(),
});
export type TransactionRecord = z.infer<typeof TransactionRecordSchema>;

export const TrafficSeriesPointSchema = z.object({
  slot: z.string(),
  legitimateCount: z.number().nonnegative(),
  blockedCount: z.number().nonnegative(),
});
export type TrafficSeriesPoint = z.infer<typeof TrafficSeriesPointSchema>;

export const HourlySalesPointSchema = z.object({
  hour: z.string(),
  revenue: z.number().nonnegative(),
  crossSellOrders: z.number().nonnegative(),
});
export type HourlySalesPoint = z.infer<typeof HourlySalesPointSchema>;

export const CrossSellingComboMetricSchema = z.object({
  comboId: z.string(),
  primaryProductName: z.string(),
  companionProductName: z.string(),
  coPurchaseRatePercent: z.number(),
  impressions: z.number().int().nonnegative(),
  conversions: z.number().int().nonnegative(),
  conversionRatePercent: z.number(),
});
export type CrossSellingComboMetric = z.infer<typeof CrossSellingComboMetricSchema>;

export const GeoCommercialZoneSchema = z.object({
  zoneId: z.string(),
  zoneName: z.string(),
  city: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  topProduct: z.string(),
  topCategory: z.string(),
  companionProduct: z.string(),
  totalVolume: z.number().nonnegative(),
  ordersCount: z.number().int().nonnegative(),
  demandIntensity: z.enum(['alta', 'media', 'emergente']),
});
export type GeoCommercialZone = z.infer<typeof GeoCommercialZoneSchema>;

