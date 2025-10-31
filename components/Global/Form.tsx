"use client";

import React from "react";
import Button from "./Button";
import Dropdown from "./Dropdown";

interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  value?: string; 
  onChange?: (name: string, value: string) => void;
  disabled?: boolean;
}

interface FormProps {
  fields: any;
  onSubmit: (data: Record<string, string>) => void;
  className?: string;
  submitButtonText?: string;
  submitClassName?: string;
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  className = "",
  submitButtonText = "Submit",
  submitClassName = "bg-[#3b82f6] hover:bg-[#1c59bb]",
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {fields.map((field: any) => (
        <div key={field.name} className="flex flex-col">
          <label
            htmlFor={field.name}
            className="text-sm font-medium text-[var(--foreground)] mb-1"
          >
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "select" && field.options ? (
            <Dropdown
              name={field.name}
              options={field.options}
              value={field.value || ""}
              onChange={(value) => field.onChange?.(field.name, value)}
              required={field.required}
              placeholder={field.placeholder}
              disabled={field.disabled || false}
            />
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              value={field.value || ""}
              disabled={field.disabled || false}
              onChange={(e) => field.onChange?.(field.name, e.target.value)}
              className="px-3 py-2 border border-[#e1dfeb61] rounded-md text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
            />
          )}
        </div>
      ))}
      <Button type="submit" className={submitClassName}>
        {submitButtonText}
      </Button>
    </form>
  );
};

export default Form;