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
} from "../types";

interface GetActivitiesQueryParams {
  type?: ActivityType | string;
  month?: number;
  year?: number;
  isNextMatch?: boolean;
  isFeaturedEvent?: boolean;
}

interface UseActivitiesResult {
  activities: Activity[] | undefined;
  activitiesLoading: boolean;
  activitiesError: AxiosError<BackendErrorResponse> | null;
  createActivity: (data: ActivityFormData) => void;
  updateActivity: (args: {
    id: string;
    activityData: Partial<ActivityFormData>;
  }) => void;
  deleteActivity: (id: string) => void;
  isCreatingActivity: boolean;
  isUpdatingActivity: boolean;
  isDeletingActivity: boolean;
}

interface UseActivitiesOptions {
  params?: GetActivitiesQueryParams;
  enabled?: boolean;
}

const useActivities = (options?: UseActivitiesOptions): UseActivitiesResult => {
  const queryClient = useQueryClient();

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
    staleTime: 1000 * 60 * 2,
    enabled: options?.enabled !== undefined ? options.enabled : true, // Enable by default unless specified
  });

  // Mutation to create a new activity
  const createActivityMutation = useMutation<
    ApiResponse<Activity>,
    AxiosError<BackendErrorResponse>,
    ActivityFormData
  >({
    mutationFn: async (activityData) => {
      const response = await axiosInstance.post("/activities", activityData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
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
    { id: string; activityData: Partial<ActivityFormData> }
  >({
    mutationFn: async ({ id, activityData }) => {
      const response = await axiosInstance.put(
        `/activities/${id}`,
        activityData
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activity", data.data?._id] });
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
      queryClient.invalidateQueries({ queryKey: ["activities"] });
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
    createActivity: createActivityMutation.mutate,
    updateActivity: updateActivityMutation.mutate,
    deleteActivity: deleteActivityMutation.mutate,
    isCreatingActivity: createActivityMutation.isPending,
    isUpdatingActivity: updateActivityMutation.isPending,
    isDeletingActivity: deleteActivityMutation.isPending,
  };
};

export default useActivities;
