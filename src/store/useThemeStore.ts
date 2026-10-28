import { create } from 'zustand';
import type { AdminToolTab, ThemeMode, UserRole } from '../contracts/commerce.schema';

const THEME_STORAGE_KEY = 'sentinel_global_theme';

export function resolveDocumentDarkClass(theme: ThemeMode): boolean {
  return theme === 'dark';
}

function applyThemeToDocument(theme: ThemeMode): void {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', resolveDocumentDarkClass(theme));
  }
}

function readPersistedTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  return saved === 'dark' ? 'dark' : 'light';
}

interface ThemeStoreState {
  theme: ThemeMode;
  role: UserRole;
  adminTab: AdminToolTab;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setRole: (role: UserRole) => void;
  setAdminTab: (tab: AdminToolTab) => void;
  resetThemeState: () => void;
}

const initialTheme = readPersistedTheme();
applyThemeToDocument(initialTheme);

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  theme: initialTheme,
  role: 'client',
  adminTab: 'security',

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    applyThemeToDocument(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },

  setRole: (role) => {
    // Unified theme across both profiles: preserve current theme on role change
    applyThemeToDocument(get().theme);
    set({ role });
  },

  setAdminTab: (adminTab) => {
    set({ adminTab });
  },

  resetThemeState: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }
    applyThemeToDocument('light');
    set({
      theme: 'light',
      role: 'client',
      adminTab: 'security',
    });
  },
}));
