"use client";

import React, { ChangeEvent, useRef } from "react";
import Image from "next/image";
import { Images } from "@/Assets";
import Button from "../Global/Button";
import { useTranslations } from "next-intl";

interface ProfileCoverProps {
  profileImage?: string;
  onImageChange: (file: File) => void;
  coverImage: string;
  handleDeleteAccount: () => void;
}

const ProfileCover: React.FC<ProfileCoverProps> = ({ profileImage, onImageChange, coverImage, handleDeleteAccount }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const translate = useTranslations("Profile");
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="relative w-full h-64">
      {/* Background Image */}
      <div className="absolute inset-0 bg-opacity-50 bg-cover bg-center">
        <Image
          src={coverImage}
          alt="Profile Cover"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Profile Image */}
      <div className="absolute bottom-4 left-10">
        <div
          className="relative w-[210px] h-[210px] rounded-md overflow-hidden border-4 border-white cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleImageClick}
        >
          <Image
            src={profileImage || Images.ProfileImage}
            alt="Profile"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-base font-medium">{translate("Upload")}</span>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      {/* <Button className="absolute bottom-4 right-10 bg-red-500 text-white px-3 py-1 hover:bg-red-600 border border-red-500 rounded-md text-[12px]"
       onClick={handleDeleteAccount}
       >
        {translate("DeleteAccountButton")}
      </Button> */}
    </div>
  );
};

export default ProfileCover;