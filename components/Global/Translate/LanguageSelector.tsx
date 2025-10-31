"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Icons } from "@/Assets";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/Middlewares/index";
import { useTransition } from 'react';

const LanguageList = [
  { name: "แบบไทย (Thai)", code: "th" },
  { name: "English", code: "en" },
];

function TranslateButton() {
  const translate = useTranslations("LanguageSwitcher");
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const pathname = usePathname();
  const localActive = useLocale();
  const router = useRouter()
  const [isPending, startTransition] = useTransition();

  const handleLanguageSelect = (nextLocale: string) => {
    startTransition(() => {
      const currentQuery = new URLSearchParams(window.location.search);
      const newSearch = currentQuery.toString();
      const completePath = pathname + (newSearch ? `?${newSearch}` : '');
      router.replace(completePath, { locale: nextLocale });
    });
  };

  const filteredLanguages = LanguageList.filter((language) =>
    language.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="z-[101] absolute top-full right-0 mt-2 w-48 h-[188px] px-4 py-3.5 bg-white rounded-[10px] shadow-xl border border-[#e7e9f1] flex-col justify-start items-start gap-5 inline-flex">
      <div className="w-full pb-4 flex-col justify-start items-start gap-5 flex">
        <div
          className="w-full px-4 h-9 bg-[#f4f4f4] rounded-[10px] flex justify-start items-center gap-3"
        >
          <Image src={Icons.SearchIcon} alt="Search" width={16} height={16} />
          <input
            ref={inputRef}
            type="text"
            placeholder={translate("Search")}
            className="w-full h-full bg-transparent text-gray-dark text-xs font-medium leading-tight tracking-tight focus:outline-none focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredLanguages.map((language, index) => (
          <button
            key={index}
            onClick={() => handleLanguageSelect(language.code)}
            className={`self-stretch px-4 py-[11px] bg-[#f9f9f9] rounded-[10px] justify-start items-center gap-3 inline-flex ${localActive === language.code ? 'text-primary-dark': 'text-[#a1a5b7]'}`}
          >
            <span className="text-xs font-medium leading-tight tracking-tight">
              {language.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TranslateButton;
