import { useSelector } from "react-redux";
import LineData from "../json/line.json";
import { RootState } from "../redux/config/configStore";
import { useEffect, useState } from "react";
import { TypeFavoriteStationsList } from "../type/types";

function Favorite() {
  // Favorite(pinned) stations data
  const favoriteList = useSelector(
    (state: RootState) => state.favoriteList.favoriteList
  );
  const [favoriteStationsList, setFavoriteStationsList] =
    useState<TypeFavoriteStationsList[]>(favoriteList);

  // GET STORED FAVORITE STATION LIST FROM LOCAL STORAGE
  useEffect(() => {
    const storedFavoriteList = localStorage.getItem("favoriteList");
    setFavoriteStationsList(
      storedFavoriteList ? JSON.parse(storedFavoriteList) : []
    );
  }, []);

  const getLineColor = (lineName: string) => {
    const line = LineData.find((line) => line.name === lineName);
    return line ? line.color : "#000000"; // Black as default
  };

  return (
    <div className="w-full my-[0] mx-auto px-[30px] sm:px-[190px] bg-[#F5F5F5] min-h-[calc(100vh-131px)]">
      <br />
      {/* <p className="text-center sm:text-left"> Favorite page is coming soon!</p> */}
      <div className="flex flex-col gap-[10px] mb-[87px]">
        <p className="uppercase text-center sm:text-start pb-[20px] sm:pb-[10px] color-[#4B5563] font-[700]">
          Favorite Stations
        </p>
        {/* Filter By Line */}
        <ul className="flex flex-col flex-wrap sm:flex-row gap-[10px] sm:gap-[15px]">
          {favoriteStationsList.map((arrival, index) => {
            const lineColor = getLineColor(arrival.lineName); // Get the line color for each station

            return (
              <div key={index}>
                <div className="flex flex-col">
                  <ul className="flex flex-col gap-[15px]">
                    <li
                      key={index}
                      className="flex justify-between px-[15px] bg-white rounded-[13px] p-[10px] min-w-[200px] cursor-pointer flex-wrap transition-shadow duration-300 hover:shadow-lg"
                    >
                      <div className="flex flex-col">
                        <div className="flex relative justify-start">
                          <div
                            className="flex absolute top-1/2 -translate-y-1/2 w-[8px] h-[8px] sm:w-[11px] sm:h-[11px] rounded-[50%]"
                            style={{ backgroundColor: lineColor }}
                          />
                          <p className="text-[13px] sm:text-[14px] font-[700] pl-[13px] sm:pl-[19px]">
                            {arrival.stationName.replace(
                              "Underground Station",
                              ""
                            )}
                          </p>
                        </div>
                        <div className="bg-white"></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Favorite;
