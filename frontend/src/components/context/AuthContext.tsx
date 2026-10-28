import {
  createContext,
  useContext,
  useState,
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

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = sessionStorage.getItem("auth_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem("auth_token");
  });

  const login = (data: LoginResponse) => {
    sessionStorage.setItem("auth_user", JSON.stringify(data.user));
    sessionStorage.setItem("auth_token", data.token);

    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}