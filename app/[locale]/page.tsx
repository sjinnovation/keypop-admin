"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/storage";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    }else{
      router.push("/dashboard");
    }
  }, []);

  return null;
};

export default HomePage;
