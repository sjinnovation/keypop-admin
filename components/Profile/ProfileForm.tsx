"use client";

import React, { useState } from "react";
import Form from "../Global/Form";
import Button from "../Global/Button";
import { useAccountType } from "@/Hooks/useAccountType";
import { updateUser } from "@/Api/UserApi";
import { toast } from "react-toastify";
import { UserRole } from "@/constant/enum";
import { roleOptions } from "@/utils/formatters";
import { FAILED_TO_UPDATE_PROFILE, PROFILE_UPDATED_SUCCESSFULLY } from "@/constant/ToastContants";
import { useTranslations } from "next-intl";

const ProfileForm: React.FC<{user: any, refetch: any}> = ({user, refetch}) => {
  const translate = useTranslations("Profile");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fields = [
    {
      label: translate("Name"),
      name: "name",
      type: "text",
      placeholder: "Enter your name",
      required: true,
      value: formData.name,
      onChange: (name: string, value: string) => setFormData({ ...formData, [name]: value }),
    },
    {
      label: translate("Email"),
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
      value: formData.email,
      onChange: (name: string, value: string) => setFormData({ ...formData, [name]: value }),
    },
    {
      label: translate("Role"),
      name: "role",
      type: "text",
      value: formData.role,
      disabled: true,
    },
  ];

  const handleSubmit = async (data: Record<string, string>) => {
    if (!user?._id) return;
    setLoading(true);
    let formDataToSend = {};
    formDataToSend = {
        name: data.name?data.name:undefined,
        email: data.email?data.email:undefined,
        profileImage: profileImage ? profileImage : undefined
    };
    try {
      await updateUser(user._id, formDataToSend);
      toast.success(PROFILE_UPDATED_SUCCESSFULLY);
      refetch();
    } catch (error: any) {
      toast.error(error.message || FAILED_TO_UPDATE_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 my-6">
      <Form fields={fields} onSubmit={handleSubmit} className="border border-gray-250 rounded-md p-4" submitButtonText={translate("SaveButton") }/>
    </div>
  );
};

export default ProfileForm;