"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Sidebar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<{ label: string; link: string }[]>([]);
  const pathname = usePathname();
  const translate = useTranslations("Sidebar");

  useEffect(() => {
    const user: any = getUser();

    const superAdminItems = [
      { label: translate("AdminManagement"), link: "/dashboard/manage-admins" },
      { label: translate("Surveys"), link: "/dashboard/survey" },
      { label: translate("ContactRequests"), link: "/dashboard/contact-requests" },
      { label: translate("countryManagement"), link: "/dashboard/manage-countries" },
      { label: translate("Profile"), link: "/dashboard/profile" },
    ];

    const adminItems = [
      { label: translate("Surveys"), link: "/dashboard/survey" },
      { label: translate("countryManagement"), link: "/dashboard/manage-countries" },
      { label: translate("Profile"), link: "/dashboard/profile" },
    ];

    const communityAdminItems = [
      { label: translate("Surveys"), link: "/dashboard/survey" },
      { label: translate("Profile"), link: "/dashboard/profile" },
    ];

    if (user.role === "superadmin") {
      setItems(superAdminItems);
    } else if (user.role === "admin") {
      setItems(adminItems);
    } else if (user.role === "communityadmin"){
      setItems(communityAdminItems);
    }
  }, []);

  return (
    <div className="flex">
      <div
        className={`fixed lg:relative top-0 left-0 h-full w-60 bg-[#f6f5fa] text-[#8f8db0] p-6 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col justify-between`}
      >
        <ul className="flex flex-col space-y-4 mt-10">
          <li>
            <Link
              href="/dashboard"
              className={`block px-4 py-2 rounded-md hover:bg-[#e1dfeb61] transition ${
                pathname === "/dashboard" ? "bg-[#e1dfeb61]" : ""
              }`}
            >
              {translate("Dashboard")}
            </Link>
          </li>

          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                className={`block px-4 py-2 rounded-md hover:bg-[#e1dfeb61] transition ${
                  pathname === item.link ? "bg-[#e1dfeb61]" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={logout}
          className="mt-auto bg-red-500 text-white p-2 rounded mb-5"
        >
          {translate("Logout")}
        </button>
      </div>

      <div className={`flex-1 transition-all`}>
        <button
          className="lg:hidden p-2 fixed top-4 left-4 z-50 bg-[#e1dfeb61] text-[#8f8db0] rounded-md px-3 py-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>
    </div>
  );
}
