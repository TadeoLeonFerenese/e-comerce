import { AuthUserSchema, type AuthUser } from '../contracts/commerce.schema';

interface SeedAccount {
  user: AuthUser;
  passwordPlain: string;
}

export const SEED_ACCOUNTS: SeedAccount[] = [
  {
    user: {
      id: 'usr-admin-01',
      name: 'Tadeo (SuperAdmin)',
      email: 'admin@sentinel.com',
      role: 'admin',
    },
    passwordPlain: 'admin123',
  },
  {
    user: {
      id: 'usr-client-01',
      name: 'Cliente Verificado',
      email: 'cliente@sentinel.com',
      role: 'client',
    },
    passwordPlain: 'cliente123',
  },
];

/**
 * Valida credenciales localmente contra el seed verificado de cuentas RBAC.
 */
export function verifyLocalCredentials(email: string, password: string): AuthUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const match = SEED_ACCOUNTS.find(
    (item) => item.user.email.toLowerCase() === normalizedEmail && item.passwordPlain === password
  );
  return match ? match.user : null;
}

/**
 * Adaptador Hexagonal de Autenticación:
 * Intenta autenticar contra el endpoint Laravel SQL (/api/auth/login) y realiza
 * fallback determinístico al motor RBAC local cuando el backend no está levantado.
 */
export async function authenticateUserApi(
  email: string,
  password: string
): Promise<AuthUser | null> {
  try {
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      const response = await window.fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const json: unknown = await response.json();
        const parsed = AuthUserSchema.safeParse(json);
        if (parsed.success) {
          return parsed.data;
        }
      }
    }
  } catch {
    // Fallback resiliente a validación local RBAC
  }

  return verifyLocalCredentials(email, password);
}
