import React from "react";
import Logo from "../../../../public/logo-50.svg";

function Header() {
  return (
    <div className="flex justify-start w-full h-[57px] p-[10px] bg-white border">
      <div className="flex justify-start w-full ">
        <div className="flex justify-center items-center gap-[3px] border cursor-pointer">
          <img
            src={Logo}
            height={32}
            width={32}
            alt="Tube Time Logo"
            className="w-[23px] h-[22px]"
          />
          <p className="text-[18px] font-[700]">TubeTime</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
