import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore, resolveDocumentDarkClass } from '../useThemeStore';

describe('useThemeStore — Unified Global Theme & Role Switcher', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
    useThemeStore.getState().resetThemeState();
  });

  it('starts in light mode and client role by default and applies theme globally across both profiles', () => {
    const state = useThemeStore.getState();
    expect(state.theme).toBe('light');
    expect(state.role).toBe('client');
    expect(state.adminTab).toBe('security');
    expect(resolveDocumentDarkClass('light')).toBe(false);
    expect(resolveDocumentDarkClass('dark')).toBe(true);
  });

  it('toggles global theme between light and dark for both client and admin profiles and persists in localStorage', () => {
    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(window.localStorage.getItem('sentinel_global_theme')).toBe('dark');

    // Switching role between client and admin preserves the user-selected dark theme
    useThemeStore.getState().setRole('admin');
    expect(useThemeStore.getState().role).toBe('admin');
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    useThemeStore.getState().setRole('client');
    expect(useThemeStore.getState().role).toBe('client');
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('switches between Administrator tools (SecurityView and MarketingView)', () => {
    useThemeStore.getState().setRole('admin');
    useThemeStore.getState().setAdminTab('marketing');

    expect(useThemeStore.getState().adminTab).toBe('marketing');

    useThemeStore.getState().setAdminTab('security');
    expect(useThemeStore.getState().adminTab).toBe('security');
  });
});
