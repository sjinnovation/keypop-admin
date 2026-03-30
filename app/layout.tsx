"use client"
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="h-screen" suppressHydrationWarning>
        <ToastContainer />
          {children} 
        </body>
      </html>
    </AuthProvider>
    </QueryClientProvider>
  );
}
