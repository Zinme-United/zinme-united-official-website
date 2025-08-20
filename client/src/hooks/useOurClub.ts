import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import type { ApiResponse, BackendErrorResponse } from "../types";
import type { AxiosError } from "axios";
import type { OurClubInput } from "../schemas/ourClubSchemas";

export const useGetAbout = () =>
  useQuery<
    ApiResponse<OurClubInput>,
    AxiosError<BackendErrorResponse>,
    OurClubInput
  >({
    queryKey: ["our-club"],
    queryFn: async () => {
      const res = await axiosInstance.get("/our-club");
      return res.data?.data;
    },
    staleTime: 1000 * 60,
  });

export const useUpdateAbout = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<OurClubInput>,
    AxiosError<BackendErrorResponse>,
    OurClubInput
  >({
    mutationFn: async (data) => {
      const res = await axiosInstance.put("/our-club", data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["our-club"] });
    },
  });
};

export const useDeleteAbout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete("/our-club");
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["our-club"] }),
  });
};

export const uploadOurClubHeroImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await axiosInstance.post("/our-club/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data; // { imageUrl, publicId }
};
