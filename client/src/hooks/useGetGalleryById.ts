import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, BackendErrorResponse, Gallery } from "../types";
import type { AxiosError } from "axios";
import axiosInstance from "../api/axiosInstance";

const useGetGalleryById = (id: string | undefined) => {
  return useQuery<
    ApiResponse<Gallery>, // queryFn returns ApiResponse<Gallery>
    AxiosError<BackendErrorResponse>, // error type
    Gallery // we want to expose plain Gallery
  >({
    queryKey: ["gallery", id],
    queryFn: async () => {
      if (!id) throw new Error("Gallery ID is required");
      const response = await axiosInstance.get<ApiResponse<Gallery>>(
        `/galleries/${id}`
      );
      return response.data;
    },
    select: (res) => res.data as Gallery,
    enabled: !!id,
    staleTime: 1000 * 60,
  });
};

export default useGetGalleryById;
