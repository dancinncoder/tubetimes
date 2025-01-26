import React from "react";
import Logo from "../../../assets/header/logo-50.svg";

function Header() {
  return (
    <header className="sticky top-[0] flex justify-start w-full h-[64px]  bg-white my-[0] mx-auto px-[20px] sm:px-[30px] md:px-[150px] lg:px-[190px] z-[99999999]">
      <div className="flex justify-start w-full ">
        <a
          href="/"
          className="flex justify-center items-center gap-[4px] cursor-pointer no-underline"
        >
          <img
            src={Logo}
            height={32}
            width={32}
            alt="Tube Time Logo"
            className="w-[23px] h-[22px]"
          />
          <p className="text-[20px] font-[700]">TubeTime</p>
        </a>
      </div>
    </header>
  );
}

export default Header;
