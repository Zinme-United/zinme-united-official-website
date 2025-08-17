import React from "react";
import { LoginForm } from "../../components";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Navigate } from "react-router";

const LoginPage: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
