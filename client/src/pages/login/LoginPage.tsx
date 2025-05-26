import React from "react";
import { LoginForm } from "../../components";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
