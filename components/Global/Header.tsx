"use client";

import TranslateButton from "./Translate/Translate";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-[65px] border-2 border-[#f6f5fa] bg-[#fbfbfb] text-[#8f8db0] flex items-center justify-between px-6 z-30">
      {/* Left side (empty or for logo if needed) */}
      <div></div>

      {/* Right side with TranslateButton */}
      <div className="flex items-center">
        <TranslateButton />
      </div>
    </header>
  );
};

export default Header;