'use client'
import { useState, useEffect, useRef } from "react";
import LanguageSelector from "./LanguageSelector";
import { Global } from "iconsax-react";
import { useTranslations } from "next-intl";

const TranslateButton = () => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const translate = useTranslations("LanguageSwitcher");

  const handleButtonClick = () => {
    setShowLanguageSelector(!showLanguageSelector);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !(containerRef.current as HTMLDivElement).contains(event.target as Node)) {
      setShowLanguageSelector(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleButtonClick}
        title={translate("Tooltip")}
        className="h-11 p-[11px] rounded-[10px] border border-[#E8EAF2] justify-start items-center gap-3 inline-flex"
      >
        <Global size="22" color="#A19EC1" variant="Bold"/>
      </button>

      {showLanguageSelector && <LanguageSelector />}
    </div>
  );
}

export default TranslateButton;