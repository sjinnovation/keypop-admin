"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[var(--background)] rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {title && (
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
            {title}
          </h2>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[var(--foreground)] hover:text-[#4a4965] text-2xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;