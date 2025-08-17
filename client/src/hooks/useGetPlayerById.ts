import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";
import type { ApiResponse, BackendErrorResponse, Player } from "../types";

const usePlayerById = (id: string | undefined) => {
  return useQuery<
    ApiResponse<Player>,
    AxiosError<BackendErrorResponse>,
    Player
  >({
    queryKey: ["player", id],
    queryFn: async () => {
      if (!id) throw new Error("Player ID is required");
      const response = await axiosInstance.get(`/players/${id}`);
      return response.data;
    },
    enabled: !!id, // don’t run if no id
    staleTime: 1000 * 60, // 1 minute
  });
};

export default usePlayerById;
