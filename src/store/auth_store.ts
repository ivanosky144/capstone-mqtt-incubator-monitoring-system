import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode'; 

interface User {
  email: string;
  token: string;
  id: number | undefined;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  login: (payload: any) => Promise<void>;
  logout: () => void;
  register: (payload: any) => Promise<void>;
}

const isTokenValid = (token: string): boolean => {
  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

interface User {
  email: string;
  token: string;
  id: number | undefined;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  login: (payload: any) => Promise<void>;
  logout: () => void;
  register: (payload: any) => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,

  login: async (payload: any) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json(); 
      const { token } = data;
      const decodedToken: any = jwtDecode(token);

      set({ 
        user: { email: payload.email, token, id: decodedToken._id }, 
        loading: false, 
        isLoggedIn: true 
      });

      localStorage.setItem('token', token); 
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  logout: () => {
    set({ user: null, isLoggedIn: false });
    localStorage.removeItem('token');
  },

  register: async (payload: any) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
}));

export default useAuthStore;


