"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface User {
  _id?: string;
  id?: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

interface ErrorResponse {
  message: string;
  errors?: Array<{ msg: string; param?: string; location?: string }>;
}

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  performPasswordReset: (token: string, newPassword: string) => Promise<void>;
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
          const errorData: ErrorResponse = await response
            .json()
            .catch(() => ({ message: "Failed to fetch user details" }));
          throw new Error(errorData.message || "Failed to fetch user details");
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
        const errorData: ErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to sign up" }));
        throw new Error(errorData.message || "Failed to sign up");
      }
      const data: AuthResponse = await response.json();
      return data;
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
        const errorData: ErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to login" }));
        throw new Error(errorData.message || "Failed to login");
      }
      const data: AuthResponse = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem(
        "sessionExpiry",
        (Date.now() + 60 * 60 * 1000).toString()
      );
      setCurrentUser(data.user);
      return data;
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
      const response = await fetch(
        `${API_URL}/api/auth/request-password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      if (!response.ok) {
        const errorData: ErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to request password reset" }));
        throw new Error(
          errorData.message || "Failed to request password reset"
        );
      }
    } catch (error) {
      console.error("Reset password request error:", error);
      throw error;
    }
  };

  const performPasswordReset = async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );
      if (!response.ok) {
        const errorData: ErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to perform password reset" }));
        throw new Error(
          errorData.message || "Failed to perform password reset"
        );
      }
    } catch (error) {
      console.error("Perform password reset error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const sessionExpiry = localStorage.getItem("sessionExpiry");
      if (token && sessionExpiry && Date.now() < parseInt(sessionExpiry, 10)) {
        const userDetails = await fetchUserDetails(token);
        if (userDetails) {
          setCurrentUser(userDetails);
        } else {
          logout();
        }
      } else if (token) {
        logout();
      }
      setLoading(false);
    };
    initializeUser();
  }, [fetchUserDetails]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        performPasswordReset,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
