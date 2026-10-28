import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';
import { useThemeStore } from '../useThemeStore';

describe('useAuthStore — Hybrid Authentication & RBAC Role Guards', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.getState().resetAuthState();
    useThemeStore.getState().resetThemeState();
  });

  it('starts unauthenticated and rejects invalid credentials with explicit error', () => {
    expect(useAuthStore.getState().currentUser).toBeNull();

    const success = useAuthStore.getState().login('hacker@evil.com', 'wrongpass');
    expect(success).toBe(false);
    expect(useAuthStore.getState().currentUser).toBeNull();
    expect(useAuthStore.getState().authError).toMatch(/Credenciales inválidas/i);
  });

  it('authenticates Administrator account and persists session in localStorage', () => {
    const success = useAuthStore.getState().login('admin@sentinel.com', 'admin123');
    expect(success).toBe(true);

    const user = useAuthStore.getState().currentUser;
    expect(user).not.toBeNull();
    expect(user?.role).toBe('admin');
    expect(user?.email).toBe('admin@sentinel.com');
    expect(window.localStorage.getItem('sentinel_auth_user')).toContain('admin@sentinel.com');
  });

  it('authenticates Client account with client role and revokes Admin view on logout', () => {
    // Primero loguea como Admin y entra al Backoffice
    useAuthStore.getState().login('admin@sentinel.com', 'admin123');
    useThemeStore.getState().setRole('admin');
    expect(useThemeStore.getState().role).toBe('admin');

    // Al cerrar sesión, revoca inmediatamente el acceso al Backoffice y vuelve a Tienda
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().currentUser).toBeNull();
    expect(useThemeStore.getState().role).toBe('client');

    // Luego loguea como Cliente común
    const clientLogin = useAuthStore.getState().login('cliente@sentinel.com', 'cliente123');
    expect(clientLogin).toBe(true);
    expect(useAuthStore.getState().currentUser?.role).toBe('client');
    expect(useThemeStore.getState().role).toBe('client');
  });
});
