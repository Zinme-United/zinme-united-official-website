// src/components/ProtectedRoute.tsx
import React, { type ReactNode } from "react";
import { useSelector } from "react-redux"; // Import useSelector from react-redux
import type { RootState } from "../store"; // Assuming your Redux store's RootState type is here
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  children?: ReactNode; // Allows for direct children if used as a wrapper component
  allowedRoles?: ("admin" | "editor" | "public")[]; // Array of roles allowed to access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  const isLoading = !user && !!token;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">
          Loading authentication...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
