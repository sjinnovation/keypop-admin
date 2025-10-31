"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/Api/UserApi";

interface UserInfo {
  data:{
    _id: string;
    name: string;
    email: string;
    role: string;
    profileImage: string;
    createdAt: string;
    updatedAt: string;
  }
}


export function useAccountType() {
  const { data, isLoading, error, refetch } = useQuery<UserInfo, Error>({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    // refetchOnWindowFocus: false,
  });

  return {
    user: data?.data,
    isLoading,
    error,
    refetch,
  };
}