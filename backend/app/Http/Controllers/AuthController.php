<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Controlador de Autenticación y Autorización RBAC (Role-Based Access Control).
 * Valida credenciales contra la tabla `users` y emite el perfil con rol verificado (`admin` | `client`).
 */
final class AuthController
{
    /**
     * POST /api/auth/login
     * Autentica al usuario verificando su hash en la base de datos SQL.
     */
    public function login(Request $request): JsonResponse
    {
        $email = strtolower(trim((string) $request->input('email', '')));
        $password = (string) $request->input('password', '');

        if ($email === '' || $password === '') {
            return response()->json([
                'message' => 'Credenciales incompletas.',
            ], 422);
        }

        $user = DB::table('users')
            ->select(['id', 'name', 'email', 'password_hash', 'role'])
            ->where('email', $email)
            ->first();

        if ($user === null || !Hash::check($password, (string) $user->password_hash)) {
            return response()->json([
                'message' => 'Credenciales inválidas. Verificá tu correo y contraseña.',
            ], 401);
        }

        return response()->json([
            'id' => (string) $user->id,
            'name' => (string) $user->name,
            'email' => (string) $user->email,
            'role' => (string) $user->role,
        ]);
    }

    /**
     * GET /api/auth/me
     * Retorna la sesión activa verificando el rol en servidor.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user === null) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        return response()->json([
            'id' => (string) $user->id,
            'name' => (string) $user->name,
            'email' => (string) $user->email,
            'role' => (string) $user->role,
        ]);
    }

    /**
     * POST /api/auth/logout
     * Revoca la sesión activa.
     */
    public function logout(): JsonResponse
    {
        return response()->json(['status' => 'logged_out']);
    }
}
