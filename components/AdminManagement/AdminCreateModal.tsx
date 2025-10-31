"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Global/Modal";
import Form from "../Global/Form";
// import { roleOptions } from "@/utils/formatters";
import { UserRole } from "@/constant/enum";
import { PASSWORD_DO_NOT_MATCH } from "@/constant/ToastContants";
import { useTranslations } from "next-intl";
import { createAdminUser, updateUser } from "@/Api/UserApi";
import { toast } from "react-toastify";

interface AdminCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback for when create/update is successful
  userData?: Record<string, string> | null;
  isEdit?: boolean;
}

const AdminCreateModal: React.FC<AdminCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userData = null,
  isEdit = false,
}) => {
  const translatePopup = useTranslations("AdminManagement.CreateAdminPopup");
  const [formData, setFormData] = useState<Record<string, string>>({
    name: "",
    // lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userData && isEdit) {
      setFormData({
        name: userData.name || "",
        // lastName: userData.lastName || "",
        email: userData.email || "",
        password: "",
        confirmPassword: "",
        role: userData.role || "",
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        // lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    }
  }, [userData, isEdit, isOpen]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };
 
  const roleOptions= (RoleEnum: Record<string, string>) => Object.values(RoleEnum).map((role) => ({
    label: 
        // role === "user" ? "User" :
        role === "admin" ? translatePopup("Dropdown.Admin") :
        role === "communityadmin" ? translatePopup("Dropdown.CommunityAdmin") : role,
    value: role,
  }));

  const handleSubmit = async (data: Record<string, string>) => {
    if (data.password !== data.confirmPassword) {
      setError(PASSWORD_DO_NOT_MATCH);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isEdit && userData?._id) {
        // If editing, send update request
        const updateData = {
          name: data.name,
          email: data.email,
          role: data.role,
        };
        
        // Only include password if provided
        if (data.password) {
          Object.assign(updateData, { password: data.password });
        }
        
        await updateUser(userData._id, updateData);
        toast.success("User updated successfully");
      } else {
        // If creating new user
        await createAdminUser({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        });
        toast.success("User created successfully");
      }
      
      // Only close modal and call success callback if API call succeeds
      onSuccess(); // Refresh the user list
      onClose();   // Close the modal
    } catch (err: unknown) {
      // Display the specific error message in the modal
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving the user';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { label: translatePopup("Name"), name: "name", type: "text", required: true },
    // { label: "Last Name", name: "lastName", type: "text", required: true },
    { label: translatePopup("Email"), name: "email", type: "email", required: true },
    { 
      label: translatePopup("Password"), 
      name: "password", 
      type: "password", 
      required: !isEdit 
    },
    { 
      label: translatePopup("ConfirmPassword"), 
      name: "confirmPassword", 
      type: "password", 
      required: !isEdit 
    },
    {
      label: translatePopup("Role"),
      name: "role",
      type: "select",
      options: roleOptions(UserRole),
      placeholder: translatePopup("Dropdown.Placeholder"),
      required: true,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? translatePopup("EditUser") : translatePopup("CreateNewUser")}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <Form
        fields={formFields.map((field) => ({
          ...field,
          value: formData[field.name],
          onChange: handleChange,
          disabled: isSubmitting,
        }))}
        submitButtonText={isSubmitting ? 
          (isEdit ? "Updating..." : "Creating...") : 
          translatePopup("SubmitButton")
        }
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default AdminCreateModal;