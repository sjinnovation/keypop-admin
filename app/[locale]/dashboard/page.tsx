"use client";

import { getUser } from "@/utils/storage";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
  
export default function DashboardPage() {
  const [user, setUser] = useState<any>();
  const translate = useTranslations("Sidebar");

  useEffect(() => {
    const userResponse = getUser();
    setUser(userResponse);
  }, []);

  return (
    <div className="flex h-full w-full ">
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold">{translate("Welcome")}, {user?.name}</h1>
      </div>
    </div>
  );
}
