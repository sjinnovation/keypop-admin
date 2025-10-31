"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(`px-4 py-2 rounded-md text-white bg-[#3b82f6] hover:bg-[#1c59bb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`, className)}
    >
      {children}
    </button>
  );
};

export default Button;