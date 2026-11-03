import type { ReactNode } from "react";

// User roles
export type UserRole = "admin" | "doctor" | "patient";

// Protected routes props
export type ProtectedRoutesProps = {
  role: UserRole;
  children: ReactNode;
};

// Authenticated user
export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  address: string;
  doctor_id: string;
  doctor_name: string;
  role: UserRole;
}

// Login API response
export interface LoginResponse {
  status: number;
  message: string;
  auth_token?: string;
  error?: string;
  data?: AuthUser;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ForgotPasswordForm {
  email: string;
}