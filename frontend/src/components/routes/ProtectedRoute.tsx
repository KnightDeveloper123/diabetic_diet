import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import type { UserRole } from "../types/auth.types";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;