import { useState } from "react";
import HomeIconDefault from "../../../assets/navigation/icon-home-96.svg";
import HomeIconActivated from "../../../assets/navigation/icon-home-96-activated.svg";
import MapIconDefault from "../../../assets/navigation/icon-map-90.svg";
import MapIconActivated from "../../../assets/navigation/icon-map-90-activated.svg";
import FavoriteIconDefault from "../../../assets/navigation/icon-favorite-96.svg";
import FavoriteIconActivated from "../../../assets/navigation/icon-favorite-96-activated.svg";
import SettingIconDefault from "../../../assets/navigation/icon-setting-100.svg";
import SettingIconActivated from "../../../assets/navigation/icon-setting-100-activated.svg";
import { Link } from "react-router-dom";

function Navigation() {
  const [hoveredMenuIndex, setHoveredMenuIndex] = useState<number | null>(null);
  const [activatedMenuIndex, setActivatedMenuIndex] = useState<number>(0);

  const navigationList = [
    {
      title: "Home",
      url: "/",
      iconDefault: HomeIconDefault,
      iconActivated: HomeIconActivated,
    },
    {
      title: "Map",
      url: "/map",
      iconDefault: MapIconDefault,
      iconActivated: MapIconActivated,
    },
    {
      title: "Favorite",
      url: "/favorite",
      iconDefault: FavoriteIconDefault,
      iconActivated: FavoriteIconActivated,
    },
    {
      title: "Setting",
      url: "/setting",
      iconDefault: SettingIconDefault,
      iconActivated: SettingIconActivated,
    },
  ];

  return (
    <div className="flex justify-start fixed bottom-[0] left-[0] w-full h-[67px] p-[10px] bg-white z-[9999]">
      <div className="flex justify-center w-full">
        <ul className="flex gap-[0px] sm:gap-[10px] md:gap-[20px] ">
          {navigationList.map((menu, index) => {
            const isActivated =
              activatedMenuIndex === index || hoveredMenuIndex === index;
            const imgFile = isActivated ? menu.iconActivated : menu.iconDefault;

            return (
              <li
                key={index}
                className="mx-[0] sm:mx-[10px] min-w-[74px]"
                onMouseEnter={() => setHoveredMenuIndex(index)}
                onMouseLeave={() => setHoveredMenuIndex(null)}
              >
                <Link
                  to={menu.url}
                  onClick={() => setActivatedMenuIndex(index)}
                  className={`flex flex-col gap-[6px] items-center ${
                    isActivated ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <img
                    src={imgFile}
                    alt={`${menu.title} icon`}
                    width={24}
                    height={24}
                  />
                  <p className="text-[12px]">{menu.title}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
