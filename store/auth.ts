import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profession?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: string;
  role: string;
}

interface LoginCredentials {
  tckn: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  phoneNumber: string;
  tckn: string;
  password: string;
  firstName: string;
  lastName: string;
  profession?: string;
  birthDate: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    authenticated: false,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => state.authenticated,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    errorMessage: (state) => state.error,
    userRole: (state) => state.user?.role,
    isEmailVerified: (state) => state.user?.isEmailVerified || false,
    isPhoneVerified: (state) => state.user?.isPhoneVerified || false,
  },

  actions: {
    // Clear error
    clearError() {
      this.error = null;
    },

    // Set loading state
    setLoading(loading: boolean) {
      this.loading = loading;
    },

    // Set error
    setError(error: string) {
      this.error = error;
    },

    // Set user data
    setUser(user: User | null) {
      this.user = user;
    },

    // Set authentication state
    setAuthenticated(authenticated: boolean) {
      this.authenticated = authenticated;
    },

    // Clear auth data
    clearAuth() {
      this.user = null;
      this.authenticated = false;
      this.error = null;
    },

    // Hydrate authentication state from cookies
    hydrate() {
      const config = useRuntimeConfig();
      const tokenCookie = useCookie(config.public.tokenCookieName as string);
      
      if (tokenCookie.value) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
        this.user = null;
      }
    },
  },

  // Persist state
  persist: true,
});

