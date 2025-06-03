// client/src/hooks/useActivities.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import type {
  ApiResponse,
  BackendErrorResponse,
  Activity,
  ActivityFormData,
  ActivityType,
  ImageUploadResponse,
} from "../types";

// Parameters for fetching activities
interface GetActivitiesQueryParams {
  type?: ActivityType | string; // Allow string for "All" type filter
  month?: number;
  year?: number;
  isNextMatch?: boolean; // Added for fetching next match
  isFeaturedEvent?: boolean;
}

// Return type for the useActivities hook
interface UseActivitiesResult {
  activities: Activity[] | undefined;
  activitiesLoading: boolean;
  activitiesError: AxiosError<BackendErrorResponse> | null;
  nextMatch: Activity | undefined; // New: for the single next match
  nextMatchLoading: boolean; // New: loading state for next match
  nextMatchError: AxiosError<BackendErrorResponse> | null; // New: error state for next match
  createActivity: (args: {
    data: ActivityFormData;
    homeLogoFile?: File | null;
    opponentLogoFile?: File | null;
  }) => void;
  updateActivity: (args: {
    id: string;
    activityData: Partial<ActivityFormData>;
    homeLogoFile?: File | null;
    opponentLogoFile?: File | null;
  }) => void;
  deleteActivity: (id: string) => void;
  // Expose mutation states for UI feedback
  isCreatingActivity: boolean;
  isUpdatingActivity: boolean;
  isDeletingActivity: boolean;
  uploadLogoImage: (formData: FormData) => Promise<ImageUploadResponse>;
  // FIX: Add uploadLogosMutation to the interface
  uploadLogosMutation: ReturnType<
    typeof useMutation<
      ImageUploadResponse,
      AxiosError<BackendErrorResponse>,
      FormData
    >
  >;
}

// Options for the useActivities hook, specifically for the query part
interface UseActivitiesOptions {
  params?: GetActivitiesQueryParams;
  enabled?: boolean; // Optional: control when the query runs
}

const useActivities = (options?: UseActivitiesOptions): UseActivitiesResult => {
  const queryClient = useQueryClient();

  // Query for general activities
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useQuery<ApiResponse<Activity[]>, AxiosError<BackendErrorResponse>>({
    queryKey: ["activities", options?.params], // Query key depends on params
    queryFn: async () => {
      const response = await axiosInstance.get("/activities", {
        params: options?.params,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // Data considered fresh for 2 minutes
    enabled: options?.enabled !== undefined ? options.enabled : true, // Enable by default unless specified
  });

  // New Query to fetch the single "next match"
  const {
    data: nextMatchData,
    isLoading: nextMatchLoading,
    error: nextMatchError,
  } = useQuery<
    ApiResponse<Activity[]>, // Backend returns an array, even if it's just one item
    AxiosError<BackendErrorResponse>,
    Activity | undefined // Transform the data to a single Activity object or undefined
  >({
    queryKey: ["nextMatch"],
    queryFn: async () => {
      const response = await axiosInstance.get("/activities", {
        params: { isNextMatch: true },
      });
      return response.data;
    },
    select: (data) => data.data?.[0], // Select the first item from the array
    staleTime: 1000 * 60 * 5, // Next match info can be fresh for longer
    refetchOnWindowFocus: true, // Refetch when window regains focus to keep countdown accurate
  });

  // New: Mutation for uploading a single logo image for activities
  const uploadLogosMutation = useMutation<
    ImageUploadResponse,
    AxiosError<BackendErrorResponse>,
    FormData
  >({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(
        "/activities/upload-logo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Logo uploaded successfully!");
      console.log("Logo uploaded successfully:", data.data);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload logo image.";
      toast.error(errorMessage);
      console.error("Failed to upload logo image:", errorMessage);
    },
  });

  // Mutation to create a new activity
  const createActivityMutation = useMutation<
    ApiResponse<Activity>,
    AxiosError<BackendErrorResponse>,
    {
      data: ActivityFormData;
      homeLogoFile?: File | null;
      opponentLogoFile?: File | null;
    }
  >({
    mutationFn: async ({ data, homeLogoFile, opponentLogoFile }) => {
      const formData = new FormData();
      // Append all form data fields
      Object.keys(data).forEach((key) => {
        const value = (data as any)[key];
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Append files if they exist
      if (homeLogoFile) {
        formData.append("homeTeamLogoFile", homeLogoFile);
      }
      if (opponentLogoFile) {
        formData.append("opponentTeamLogoFile", opponentLogoFile);
      }

      const response = await axiosInstance.post("/activities", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] }); // Invalidate all activities queries
      queryClient.invalidateQueries({ queryKey: ["nextMatch"] }); // Invalidate next match query
      toast.success(data.message || "Activity created successfully!");
      console.log("Activity created successfully:", data.message);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create activity.";
      toast.error(errorMessage);
      console.error("Failed to create activity:", errorMessage);
    },
  });

  // Mutation to update an activity
  const updateActivityMutation = useMutation<
    ApiResponse<Activity>,
    AxiosError<BackendErrorResponse>,
    {
      id: string;
      activityData: Partial<ActivityFormData>;
      homeLogoFile?: File | null;
      opponentLogoFile?: File | null;
    }
  >({
    mutationFn: async ({
      id,
      activityData,
      homeLogoFile,
      opponentLogoFile,
    }) => {
      const formData = new FormData();
      // Append all form data fields
      Object.keys(activityData).forEach((key) => {
        const value = (activityData as any)[key];
        // Only append if not undefined or null, unless it's an empty string for URL to indicate removal
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Append files if they exist
      if (homeLogoFile) {
        formData.append("homeTeamLogoFile", homeLogoFile);
      }
      if (opponentLogoFile) {
        formData.append("opponentTeamLogoFile", opponentLogoFile);
      }

      const response = await axiosInstance.put(`/activities/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] }); // Invalidate all activities queries
      queryClient.invalidateQueries({ queryKey: ["activity", data.data?._id] }); // Invalidate specific activity query
      queryClient.invalidateQueries({ queryKey: ["nextMatch"] }); // Invalidate next match query
      toast.success(data.message || "Activity updated successfully!");
      console.log("Activity updated successfully:", data.message);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update activity.";
      toast.error(errorMessage);
      console.error("Failed to update activity:", errorMessage);
    },
  });

  // Mutation to delete an activity
  const deleteActivityMutation = useMutation<
    ApiResponse<undefined>,
    AxiosError<BackendErrorResponse>,
    string
  >({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/activities/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] }); // Invalidate all activities queries
      queryClient.invalidateQueries({ queryKey: ["nextMatch"] }); // Invalidate next match query
      toast.success(data.message || "Activity deleted successfully!");
      console.log("Activity deleted successfully:", data.message);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete activity.";
      toast.error(errorMessage);
      console.error("Failed to delete activity:", errorMessage);
    },
  });

  return {
    activities: activitiesData?.data,
    activitiesLoading,
    activitiesError,
    nextMatch: nextMatchData, // Return the single next match object
    nextMatchLoading,
    nextMatchError,
    uploadLogoImage: uploadLogosMutation.mutateAsync, // This is now correctly typed
    createActivity: createActivityMutation.mutate,
    updateActivity: updateActivityMutation.mutate,
    deleteActivity: deleteActivityMutation.mutate,
    isCreatingActivity: createActivityMutation.isPending,
    isUpdatingActivity: updateActivityMutation.isPending,
    isDeletingActivity: deleteActivityMutation.isPending,
    uploadLogosMutation,
  };
};

export default useActivities;
