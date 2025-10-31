"use client";

import React from "react";

interface DropdownProps {
  name: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  name,
  options,
  onChange,
  value,
  placeholder = "Select an option",
  className = "",
  required = false,
  disabled = false
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className={`px-3 py-2 border border-[#e1dfeb61] rounded-md text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] bg-[var(--background)] ${className}`}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;