"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosPublic } from "@/lib/axios";
import { setToken, removeToken } from "@/utils/storage";
import { AuthContextType, User } from "@/types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

const login = async (email: string, password: string) => {
  try {
    const response = await axiosPublic.post("/auth/login", {
      email,
      password,
      admin: true,
    });

    setToken(response.data.data);
    router.push("/dashboard");
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

  const logout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
