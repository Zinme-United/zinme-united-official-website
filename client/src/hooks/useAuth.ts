// client/src/hooks/useAuth.ts
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setCredentials, logout } from "../store/authSlice";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";
import type { BackendErrorResponse } from "../types";
import type { RootState, AppDispatch } from "../store"; // Import RootState for useSelector

interface ApiResponse<T> {
  message: string;
  data?: T;
  count?: number;
  devOnly?: {
    resetToken: string;
    resetURL: string;
    warning: string;
    tokenDetails?: any;
  };
}

interface AuthResponseData {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "editor" | "public";
  token: string;
}

interface UserProfileResponseData {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "editor" | "public";
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role?: "admin" | "editor" | "public";
}

interface LoginInput {
  email: string;
  password: string;
}

interface ForgotPasswordInput {
  email: string;
}

interface ResetPasswordInput {
  token: string;
  password: string;
}

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  // --- NEW: Select isAuthenticated and user from Redux store ---
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  // Mutation for user registration
  const registerMutation = useMutation<
    ApiResponse<AuthResponseData>,
    AxiosError<BackendErrorResponse>,
    RegisterInput
  >({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data) {
        dispatch(
          setCredentials({
            user: data.data,
            token: data.data.token,
            // Note: The role is already part of data.data, so no need to pass it separately if setCredentials expects AuthUser
            // If your setCredentials expects role outside of 'user', adjust your authSlice.ts accordingly.
          })
        );
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        console.log("Registration successful:", data.message);
      }
    },
    onError: (error) => {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
    },
  });

  // Mutation for user login
  const loginMutation = useMutation<
    ApiResponse<AuthResponseData>,
    AxiosError<BackendErrorResponse>,
    LoginInput
  >({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data) {
        dispatch(
          setCredentials({
            user: data.data,
            token: data.data.token,
            // role: data.data.role, // Same as above, role is in data.data.user
          })
        );
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        console.log("Login successful:", data.message);
      }
    },
    onError: (error) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    },
  });

  // Query to fetch user profile (protected route)
  const userProfileQuery = useQuery<
    ApiResponse<UserProfileResponseData>,
    AxiosError<BackendErrorResponse>
  >({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/profile");
      return response.data;
    },
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });

  // Function to handle logout
  const handleLogout = () => {
    dispatch(logout());
    queryClient.clear();
    console.log("User logged out.");
  };

  // Mutation for forgot password (request token)
  const forgotPasswordMutation = useMutation<
    ApiResponse<undefined>,
    AxiosError<BackendErrorResponse>,
    ForgotPasswordInput
  >({
    mutationFn: async (emailData) => {
      const response = await axiosInstance.post(
        "/auth/forgotpassword",
        emailData
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Forgot password request successful:", data.message);
      if (data.devOnly) {
        console.log("DEV ONLY Token:", data.devOnly.resetToken);
        console.log("DEV ONLY URL:", data.devOnly.resetURL);
      }
    },
    onError: (error) => {
      console.error(
        "Forgot password failed:",
        error.response?.data?.message || error.message
      );
    },
  });

  // Mutation for reset password
  const resetPasswordMutation = useMutation<
    ApiResponse<AuthResponseData>,
    AxiosError<BackendErrorResponse>,
    ResetPasswordInput
  >({
    mutationFn: async ({ token, password }) => {
      const response = await axiosInstance.put(`/auth/resetpassword/${token}`, {
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data) {
        dispatch(
          setCredentials({
            user: data.data,
            token: data.data.token,
            // role: data.data.role, // Same as above, role is in data.data.user
          })
        );
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        console.log("Password reset successful:", data.message);
      }
    },
    onError: (error) => {
      console.error(
        "Password reset failed:",
        error.response?.data?.message || error.message
      );
    },
  });

  // --- MODIFIED RETURN OBJECT ---
  return {
    isLoggedIn, // NEW: Export isAuthenticated from Redux state
    user, // NEW: Export user from Redux state
    isAdmin: user?.role === "admin", // NEW: Helper for isAdmin status
    register: registerMutation.mutate, // For direct mutate call
    login: loginMutation.mutate, // For direct mutate call
    logout: handleLogout,
    userProfile: userProfileQuery.data?.data,
    userProfileLoading: userProfileQuery.isLoading,
    userProfileError: userProfileQuery.error,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    registerMutation, // For accessing mutation state (isPending, isError, etc.)
    loginMutation, // For accessing mutation state
    forgotPasswordMutation, // For accessing mutation state
    resetPasswordMutation, // For accessing mutation state
  };
};

export default useAuth;
