import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Login from "../pages/auth/login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import PatientDashboard from "../pages/patient/PatientDashboard";

import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import PatientLayout from "../layouts/PatientLayout";
import Patients from "../pages/patient/Patients";
import ProfileSettings from "../../components/pages/settings/ProfileSettings";


import ProtectedRoute from "./ProtectedRoute";
import type { UserRole } from "../types/auth.types";
import { Box, Heading, Text } from "@chakra-ui/react";

function getDashboardPath(role: UserRole) {
  switch (role) {
    case "admin":
      return "/admin";
    case "doctor":
      return "/doctor";
    case "patient":
      return "/patient";
  }
}

function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={getDashboardPath(user.role)}
      replace
    />
  );
}

function Unauthorized() {
  return (
    <Box p={8}>
      <Heading size="lg" mb={3}>
        Access Denied
      </Heading>
      <Text>You don't have permission to access this page.</Text>
    </Box>
  );
}

function NotFound() {
  return (
    <Box p={8}>
      <Heading size="lg" mb={3}>
        404 - Page Not Found
      </Heading>
      <Text>The page you requested does not exist.</Text>
    </Box>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>
        </Route>

        {/* Doctor routes */}
        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
          </Route>
        </Route>

        {/* Patient routes */}
        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<PatientDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;