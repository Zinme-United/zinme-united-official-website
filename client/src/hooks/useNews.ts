import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import type {
  ApiResponse,
  BackendErrorResponse,
  ImageUploadResponse,
  News,
  NewsCreateUpdatePayload,
} from "../types";

interface GetNewsQueryParams {
  isFeatured?: boolean;
  tag?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
}

interface UseNewsResult {
  newsArticles: News[] | undefined;
  newsLoading: boolean;
  newsError: AxiosError<BackendErrorResponse> | null;
  uploadNewsImageMutation: ReturnType<
    typeof useMutation<
      ImageUploadResponse,
      AxiosError<BackendErrorResponse>,
      FormData
    >
  >;
  createNews: (data: NewsCreateUpdatePayload) => void;
  updateNews: (args: {
    id: string;
    newsData: Partial<NewsCreateUpdatePayload>;
  }) => void;
  deleteNews: (id: string) => void;
  // Loading states for mutations
  isCreatingNews: boolean;
  isUpdatingNews: boolean;
  isDeletingNews: boolean;
}

// Options for the useNews hook
interface UseNewsOptions {
  params?: GetNewsQueryParams;
  newsId?: string;
  enabled?: boolean;
}

const useNews = (options?: UseNewsOptions): UseNewsResult => {
  const queryClient = useQueryClient();

  // Query to fetch all news articles based on filters
  const newsQuery = useQuery<
    ApiResponse<News[]>,
    AxiosError<BackendErrorResponse>
  >({
    queryKey: ["news", options?.params],
    queryFn: async () => {
      const response = await axiosInstance.get("/news", {
        params: options?.params,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });

  // Mutation for uploading a single news image
  const uploadNewsImageMutation = useMutation<
    ImageUploadResponse,
    AxiosError<BackendErrorResponse>,
    FormData
  >({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(
        "/news/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Image uploaded successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload image.";
      toast.error(errorMessage);
    },
  });

  // Mutation to create a new news article
  const createNewsMutation = useMutation<
    ApiResponse<News>,
    AxiosError<BackendErrorResponse>,
    NewsCreateUpdatePayload
  >({
    mutationFn: async (newsData) => {
      const response = await axiosInstance.post("/news", newsData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success(data.message || "News article created successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create news article.";
      toast.error(errorMessage);
    },
  });

  // Mutation to update a news article
  const updateNewsMutation = useMutation<
    ApiResponse<News>,
    AxiosError<BackendErrorResponse>,
    { id: string; newsData: NewsCreateUpdatePayload }
  >({
    mutationFn: async ({ id, newsData }) => {
      console.log("API call to update:", id, newsData);
      const response = await axiosInstance.put(`/news/${id}`, newsData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["news", data.data?._id] }); // Invalidate specific news query
      toast.success(data.message || "News article updated successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update news article.";
      toast.error(errorMessage);
    },
  });

  // Mutation to delete a news article
  const deleteNewsMutation = useMutation<
    ApiResponse<undefined>,
    AxiosError<BackendErrorResponse>,
    string
  >({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/news/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success(data.message || "News article deleted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete news article.";
      toast.error(errorMessage);
    },
  });

  return {
    newsArticles: newsQuery.data?.data,
    newsLoading: newsQuery.isLoading,
    newsError: newsQuery.error,
    uploadNewsImageMutation, // Expose the mutation object itself
    createNews: createNewsMutation.mutateAsync,
    updateNews: updateNewsMutation.mutateAsync,
    deleteNews: deleteNewsMutation.mutateAsync,
    isCreatingNews: createNewsMutation.isPending,
    isUpdatingNews: updateNewsMutation.isPending,
    isDeletingNews: deleteNewsMutation.isPending,
  };
};

export default useNews;
