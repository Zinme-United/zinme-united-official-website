import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import type {
  ApiResponse,
  BackendErrorResponse,
  Gallery,
  GalleryFormData,
  ImageUploadResponse,
} from "../types";

const useGalleries = () => {
  const queryClient = useQueryClient();

  // Query to fetch all galleries
  const galleriesQuery = useQuery<
    ApiResponse<Gallery[]>,
    AxiosError<BackendErrorResponse>,
    ApiResponse<Gallery[]>
  >({
    queryKey: ["galleries"],
    queryFn: async () => {
      const response = await axiosInstance.get("/galleries");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });

  // Mutation for uploading a single image (for galleries)
  const uploadGalleryImageMutation = useMutation<
    ImageUploadResponse,
    AxiosError<BackendErrorResponse>,
    FormData // Expects FormData for file upload
  >({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(
        "/galleries/upload-image",
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
      toast.success(data.message || "Image uploaded successfully!");
      console.log("Gallery image uploaded successfully:", data.data);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload gallery image.";
      toast.error(errorMessage);
      console.error("Failed to upload gallery image:", errorMessage);
    },
  });

  // Mutation to create a new gallery
  const createGalleryMutation = useMutation<
    ApiResponse<Gallery>,
    AxiosError<BackendErrorResponse>,
    GalleryFormData
  >({
    mutationFn: async (galleryData) => {
      const response = await axiosInstance.post("/galleries", galleryData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      toast.success(data.message || "Gallery created successfully!");
      console.log("Gallery created successfully:", data.message);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create gallery.";
      toast.error(errorMessage);
      console.error("Failed to create gallery:", errorMessage);
    },
  });

  // Mutation to update a gallery
  const updateGalleryMutation = useMutation<
    ApiResponse<Gallery>,
    AxiosError<BackendErrorResponse>,
    { id: string; galleryData: Partial<GalleryFormData> }
  >({
    mutationFn: async ({ id, galleryData }) => {
      const response = await axiosInstance.put(`/galleries/${id}`, galleryData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      queryClient.invalidateQueries({ queryKey: ["gallery", data.data?._id] }); // Invalidate single gallery query if exists
      toast.success(data.message || "Gallery updated successfully!");
      console.log("Gallery updated successfully:", data.message);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update gallery.";
      toast.error(errorMessage);
      console.error("Failed to update gallery:", errorMessage);
    },
  });

  // Mutation to delete a gallery
  const deleteGalleryMutation = useMutation<
    ApiResponse<undefined>,
    AxiosError<BackendErrorResponse>,
    string
  >({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/galleries/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      toast.success(data.message || "Gallery deleted successfully!");
      console.log("Gallery deleted successfully:", data.message);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete gallery.";
      toast.error(errorMessage);
      console.error("Failed to delete gallery:", errorMessage);
    },
  });

  return {
    galleries: galleriesQuery.data?.data,
    galleriesLoading: galleriesQuery.isLoading,
    galleriesError: galleriesQuery.error,
    uploadGalleryImage: uploadGalleryImageMutation.mutateAsync,
    createGallery: createGalleryMutation.mutate,
    updateGallery: updateGalleryMutation.mutate,
    deleteGallery: deleteGalleryMutation.mutate,
    uploadGalleryImageMutation,
    createGalleryMutation,
    updateGalleryMutation,
    deleteGalleryMutation,
  };
};

export default useGalleries;
