"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface User {
  _id?: string;
  id?: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

  const fetchUserDetails = useCallback(
    async (token: string): Promise<User | null> => {
      try {
        const response = await fetch(`${API_URL}/api/auth/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const userData = await response.json();
        return userData as User;
      } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
      }
    },
    [API_URL]
  );

  const signup = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Failed to sign up");
      }
      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem(
        "sessionExpiry",
        (Date.now() + 60 * 60 * 1000).toString()
      );
      setCurrentUser({ email });
      return data as AuthResponse;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Failed to login");
      }
      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem(
        "sessionExpiry",
        (Date.now() + 60 * 60 * 1000).toString()
      );
      setCurrentUser(data.user);
      return data as AuthResponse;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("sessionExpiry");
    setCurrentUser(null);
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("authToken");
      const sessionExpiry = localStorage.getItem("sessionExpiry");
      if (token && sessionExpiry && Date.now() < parseInt(sessionExpiry, 10)) {
        const userDetails = await fetchUserDetails(token);
        if (userDetails) {
          setCurrentUser(userDetails);
        } else {
          logout();
        }
      } else {
        logout();
      }
      setLoading(false);
    };
    initializeUser();
  }, [fetchUserDetails]);

  return (
    <AuthContext.Provider
      value={{ currentUser, signup, login, logout, resetPassword }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
