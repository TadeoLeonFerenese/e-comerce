import { create } from 'zustand';
import { AuthUserSchema, type AuthUser } from '../contracts/commerce.schema';
import { verifyLocalCredentials, authenticateUserApi } from '../services/authApi';
import { useThemeStore } from './useThemeStore';

const AUTH_STORAGE_KEY = 'sentinel_auth_user';

function readPersistedUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = AuthUserSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

interface AuthStoreState {
  currentUser: AuthUser | null;
  isLoginModalOpen: boolean;
  authError: string | null;
  setLoginModalOpen: (isOpen: boolean) => void;
  login: (email: string, password: string) => boolean;
  loginAsync: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetAuthState: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  currentUser: readPersistedUser(),
  isLoginModalOpen: false,
  authError: null,

  setLoginModalOpen: (isOpen) => {
    set({ isLoginModalOpen: isOpen, authError: null });
  },

  login: (email, password) => {
    const user = verifyLocalCredentials(email, password);
    if (!user) {
      set({
        authError: 'Credenciales inválidas. Verificá tu correo y contraseña.',
      });
      return false;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }

    set({
      currentUser: user,
      isLoginModalOpen: false,
      authError: null,
    });

    if (user.role !== 'admin') {
      useThemeStore.getState().setRole('client');
    }

    return true;
  },

  loginAsync: async (email, password) => {
    const user = await authenticateUserApi(email, password);
    if (!user) {
      set({
        authError: 'Credenciales inválidas. Verificá tu correo y contraseña.',
      });
      return false;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }

    set({
      currentUser: user,
      isLoginModalOpen: false,
      authError: null,
    });

    if (user.role !== 'admin') {
      useThemeStore.getState().setRole('client');
    }

    return true;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    useThemeStore.getState().setRole('client');
    set({
      currentUser: null,
      isLoginModalOpen: false,
      authError: null,
    });
  },

  resetAuthState: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    set({
      currentUser: null,
      isLoginModalOpen: false,
      authError: null,
    });
  },
}));
