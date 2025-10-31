"use client";

import React, { useEffect, useState } from "react";
import ProfileCover from "./ProfileCover";
import ProfileForm from "./ProfileForm";
import Preloader from "../Global/Preloader/Preloader";
import { useAccountType } from "@/Hooks/useAccountType";
import { ProfileCoverImage } from "@/Assets";
import { deleteUser } from "@/Api/UserApi";
import { toast } from "react-toastify";
import { removeToken } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { DELETE_ACCOUNT_CONFIRMATION, ACCOUNT_DELETED_SUCCESSFULLY, FAILED_TO_DELETE_ACCOUNT } from "@/constant/ToastContants";

const Profile = () => {
  const { user, isLoading, refetch } = useAccountType();
  const router = useRouter();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const handleImageChange = (file: File) => {
    setProfileImageFile(file);
  };

  const handleDeleteAccount = async() => {
    try{
      window.confirm(DELETE_ACCOUNT_CONFIRMATION);
      await deleteUser(user?._id || "");
      removeToken();
      router.push("/login");
      toast.success(ACCOUNT_DELETED_SUCCESSFULLY);
    }catch(err: any){
      toast.error(err.message || FAILED_TO_DELETE_ACCOUNT);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 h-screen">
        <Preloader />
      </div>
    );
  }

  return (
    <main className="container mx-auto">
      <ProfileCover
        profileImage={profileImageFile ? URL.createObjectURL(profileImageFile) : user?.profileImage}
        onImageChange={handleImageChange}
        coverImage={ProfileCoverImage}
        handleDeleteAccount={handleDeleteAccount}
      />
      <ProfileForm
        user={user}
        refetch={refetch}
      />
    </main>
  );
}

export default Profile;