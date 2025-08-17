import React, { type ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: ("admin" | "editor" | "public")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);


  if (!token) {
    return (
      <Navigate to="/login" replace />
    );
  }

  if (allowedRoles && !allowedRoles.includes("admin")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
