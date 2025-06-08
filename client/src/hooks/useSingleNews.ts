// hooks/useSingleNews.ts

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import type { News, ApiResponse, BackendErrorResponse } from "../types";
import { AxiosError } from "axios";

const useSingleNews = (newsId?: string) => {
  const isEnabled = !!newsId;

  const query = useQuery<ApiResponse<News>, AxiosError<BackendErrorResponse>>({
    queryKey: ["news", newsId],
    queryFn: async () => {
      if (!newsId)
        throw new Error("newsId is required to fetch single news item");
      const response = await axiosInstance.get(`/news/${newsId}`);
      return response.data;
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });

  return {
    singleNews: query.data?.data,
    singleNewsLoading: query.isLoading,
    singleNewsError: query.error,
  };
};

export default useSingleNews;
