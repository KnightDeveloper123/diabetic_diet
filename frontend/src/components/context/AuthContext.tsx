
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import type {
  AuthUser,
  LoginResponse,
} from "../types/auth.types";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Get JWT expiration time
function getTokenExpiration(token: string): number | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return typeof decoded.exp === "number"
      ? decoded.exp * 1000
      : null;
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = sessionStorage.getItem("auth_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      sessionStorage.removeItem("auth_user");
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem("auth_token");
  });

  // Logout
  const logout = useCallback(() => {
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");

    setUser(null);
    setToken(null);
  }, []);

  // Login
  const login = (response: LoginResponse) => {
    if (
      response.status !== 1 ||
      !response.data ||
      !response.auth_token
    ) {
      throw new Error("Invalid authentication response");
    }

    const userData: AuthUser = response.data;
    const authToken: string = response.auth_token;

    const expiration = getTokenExpiration(authToken);

    if (expiration !== null && expiration <= Date.now()) {
      throw new Error("Your login token has expired");
    }

    // Save user and token
    sessionStorage.setItem(
      "auth_user",
      JSON.stringify(userData)
    );

    sessionStorage.setItem("auth_token", authToken);

    // Update context
    setUser(userData);
    setToken(authToken);
  };

  // Automatically logout when token expires
  useEffect(() => {
    if (!token) return;

    const expiration = getTokenExpiration(token);

    if (expiration === null) return;

    const remainingTime = expiration - Date.now();

    if (remainingTime <= 0) {
      logout();
      return;
    }

    const timer = window.setTimeout(() => {
      logout();
    }, remainingTime);

    return () => window.clearTimeout(timer);
  }, [token, logout]);

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Auth Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
