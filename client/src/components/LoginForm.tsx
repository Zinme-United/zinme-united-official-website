import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { loginSchema, type LoginFormData } from "../schemas/authSchemas";
import { Eye, EyeOff } from "lucide-react";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    reValidateMode: "onBlur",
  });

  // Function to handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);

      navigate("/admin");
    } catch (err) {
      console.error("Login form submission error:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email")} // Register input with react-hook-form
              className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="you@example.com"
            />
            {/* Display validation error message if any */}
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password")}
              className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              // <--- MODIFIED: Added bg-transparent, border-none, outline-none, cursor-pointer
              className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border-none outline-none cursor-pointer text-sm leading-5 top-7"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Display general login error from the mutation (e.g., "Invalid credentials") */}
          {loginMutation.isError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">
                {/* Access the error message from the backend response */}
                {loginMutation.error?.response?.data?.message ||
                  loginMutation.error?.message ||
                  "An unexpected error occurred. Please try again."}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending} // Disable button while login mutation is in progress
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white
              ${
                loginMutation.isPending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-primary cursor-pointer"
              }
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {loginMutation.isPending ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* Optional: Links for forgotten password or registration */}
        <div className="mt-6 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-primary cursor-pointer"
          >
            Forgot password?
          </a>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
