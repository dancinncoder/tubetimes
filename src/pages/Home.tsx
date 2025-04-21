import { useEffect, useRef, useState } from "react";
import { getStationArrivals } from "../api/tfl";
import SearchIcon from "../assets/ui/search-50.svg";
// import FavouriteIcon from "../assets/navigation/icon-favorite-48.svg";
// import FavouriteIconActivated from "../assets/navigation/icon-favorite-48-activated.svg";
import LineData from "../json/line.json";
import StationData from "../json/station.json";

export type TypeStations = {
  id: number;
  name: string;
  lat: number;
  long: number;
  zone: string | number;
  created_at: string;
  updated_at: string;
  uid: string;
};

export type TypeRealTimeArrival = {
  id: number;
  naptanId: string;
  stationName: string;
  lineId: string;
  lineName: string;
  platformName: string;
  towards: string;
  destinationNaptanId: string;
  destinationName: string;
  timeToStation: number;
  expectedArrival: number;
  createdAt: string;
  updatedAt: string;
};

export type TypeFavoriteStationsList = {
  id: number;
  naptanId: string;
  stationName: string;
  lineId: string;
  lineName: string;
  platformName: string;
  towards: string;
};

// TODO: Complete Favorite Page Using Local Storage

function Home() {
  // All stations data
  const [stations, setStations] = useState<TypeStations[]>([]);
  // Search input
  const [station, setStation] = useState<string>("");
  // Station name for result board
  const [stationName, setStationName] = useState<string>(station);
  // Search results for list dropdown
  const [typedStationsList, setTypedStationsList] = useState<TypeStations[]>(
    []
  );
  // Favorite(pinned) stations data
  const [favoriteStationsList, setFavoriteStationsList] = useState<
    TypeFavoriteStationsList[]
  >([]);
  const [favoriteArrivalData, setFavoriteArrivalData] = useState<
    TypeRealTimeArrival[]
  >([]);

  // Flag to show/hide the search result list
  const [showResultBoard, setShowResultBoard] = useState<boolean>(false);
  const [searchedStationData, setSearchedStationData] = useState<
    TypeRealTimeArrival[]
  >([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchIntervalRef = useRef<number | undefined>(undefined);

  const handleTypeSearchStation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStation(value);

    // Update typedStationsList only if there's a search term
    if (value.trim() === "") {
      setTypedStationsList([]); // Clear search results if input is empty
      setShowResultBoard(false); // Hide result board if search term is cleared
    } else {
      showTypedStationsList(value);
      setShowResultBoard(true); // Show result board if search term is present
    }
  };

  const showTypedStationsList = (searchTerm: string) => {
    const result = stations.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTypedStationsList(result);
  };

  // GET STATION NAME USING UID
  const getStationName = (uid: string) => {
    // const stationsString = localStorage.getItem("stations");
    // // const stations = stationsString ? JSON.parse(stationsString) : [];
    // console.log("check:", stations);
    const station = stations.find((station: any) => station.uid === uid);
    // console.log("STATION:", station);

    return station ? station.name : "bingo";
  };

  // GET ARRIVAL DATA EVERY 1MINUTE FROM API, SAVE THEM IN STATE
  const getSearchedStationData = (uid: string) => {
    const fetchData = async (uid: string) => {
      try {
        // Get arrival data from tfl api
        const stationArrivalData = await getStationArrivals(uid);
        console.log("New tfl api data has arrived:", stationArrivalData);
        setSearchedStationData(stationArrivalData);

        if (!stationArrivalData || stationArrivalData.length === 0) {
          console.error("No data returned from TFL API for station:", uid);
          return [];
        }
      } catch (error) {
        console.error("Error fetching station data:", error);
        return [];
      }
    };

    fetchData(uid);
    const stationName = getStationName(uid);
    setStationName(stationName);

    return fetchData(uid);
  };

  // FETCH DATA EVERY 1MINUTE
  const startFetchingDataEveryMinute = (uid: string) => {
    // Clear existing intervals to prevent duplicates
    clearInterval(fetchIntervalRef.current);

    // Set a new interval and store its ID
    fetchIntervalRef.current = window.setInterval(() => {
      getSearchedStationData(uid);
      console.log("Real-time data has been updated.");
    }, 60000000); // 60000ms = 1 minute
  };

  // SUBMIT SEARCHED TERM/UID
  const submitSearchTerm = (
    clickedStationUid: string,
    clickedStationName: string
  ) => {
    console.log("submitted station uid:", clickedStationUid);
    setStation(clickedStationName);
    setShowResultBoard(false);
    getSearchedStationData(clickedStationUid);

    // After the choice of station, start to fetch data every 1 minute
    startFetchingDataEveryMinute(clickedStationUid);
  };

  // SUBMIT SAVED FAVORITE UID
  const submitFavorite = async (savedStationUid: string) => {
    console.log("savedStationUid", savedStationUid);

    const data = await getSearchedStationData(savedStationUid);

    // If data is valid, start fetching every minute
    if (data && data.length > 0) {
      console.log("Station data fetched successfully:", data);
      startFetchingDataEveryMinute(savedStationUid);
    } else {
      console.error("No data found for the selected station:", savedStationUid);
    }
  };

  const getLineColor = (lineName: string) => {
    const line = LineData.find((line) => line.name === lineName);
    return line ? line.color : "#000000"; // Black as default
  };

  const getExpectedArrivalTime = (timestamp: number) => {
    // Convert to a Date object
    const date = new Date(timestamp);

    // Get hours and minutes
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    // Format to 'HH:mm' (ensure 2 digits for hours and minutes)
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;

    return formattedTime;
  };

  // SORT THE STATION ARRIVAL DATA BASED ON EXPECTEDARRIVAL (TIMESTAMP)
  const sortByExpectedArrival = (data: TypeRealTimeArrival[]) => {
    return data.sort((a, b) => {
      const aDate = new Date(a.expectedArrival).getTime(); // transform to Unix timestamp
      const bDate = new Date(b.expectedArrival).getTime(); // transform to Unix timestamp

      return aDate - bDate; // descending order
    });
  };

  // SORTED STATION ARRIVAL DATA
  const sortedStationData = sortByExpectedArrival(searchedStationData);

  // FILTER ARRIVALS BY LINE
  const filterByLine = (lineName: string, data: TypeRealTimeArrival[]) => {
    return data.filter((arrival) => arrival.lineName === lineName);
  };

  // ADD NEW FAVORITE STATION DATA
  const addNewFavoriteStation = (
    selectedId: number,
    naptanId: string,
    stationName: string,
    lineId: string,
    lineName: string,
    platformName: string,
    towards: string
  ) => {
    // Check duplicates
    // const isFound = favoriteStationsList.find((item) => item.id === selectedId);
    const isFound = favoriteStationsList?.find((item) => {
      return item.stationName === stationName;
    });
    if (isFound) {
      alert(`${stationName}is already in the favorite list.`);
    } else {
      const newFavoriteStationData = {
        id: selectedId,
        naptanId: naptanId,
        stationName: stationName,
        lineId: lineId,
        lineName: lineName,
        platformName: platformName,
        towards: towards,
      };
      const updatedList = [...favoriteStationsList, newFavoriteStationData];
      // TODO: Add popup modal asking to save or not
      setFavoriteStationsList(updatedList);
      localStorage.setItem("favoriteList", JSON.stringify(updatedList));

      // Request real-time tube arrival data
      submitFavorite(naptanId);
      alert(`${stationName} has added in your favorite list.`);
    }
    console.log("favoriteList:", favoriteStationsList);
  };

  // HANDLE DROPDOWN VISIBILITY
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowResultBoard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const stationsData = StationData;
      setStations(stationsData); // Load all stations into state
      console.log("Loaded station data:", stationsData);
    };

    fetchData();
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
    };
  }, []);

  // GET STORED FAVORITE STATION LIST FROM LOCAL STORAGE
  useEffect(() => {
    const storedFavoriteList = localStorage.getItem("favoriteList");
    setFavoriteStationsList(
      storedFavoriteList ? JSON.parse(storedFavoriteList) : []
    );
  }, []);

  useEffect(() => {
    const updatedFavoriteRealTimeData = async () => {
      const updatedData: TypeRealTimeArrival[] = [];

      // Loop through favorite stations list to fetch real-time data
      for (const station of favoriteStationsList) {
        try {
          // Fetch real-time arrival data for each station using naptanId
          const data = await getSearchedStationData(station.naptanId);
          console.log("here data:", data);
          if (data && data.length > 0) {
            updatedData.push(data[0]); // Push only the first item since the API should return sorted data
          } else {
            // If no data returned, use a fallback data structure
            updatedData.push({
              id: station.id,
              naptanId: station.naptanId,
              stationName: station.stationName,
              lineId: station.lineId,
              lineName: station.lineName,
              platformName: station.platformName,
              towards: station.towards,
              destinationNaptanId: station.naptanId,
              destinationName: "",
              timeToStation: 0,
              expectedArrival: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error(
            "Error fetching real-time data for station:",
            station.stationName,
            error
          );
        }
      }

      setFavoriteArrivalData(updatedData); // Update state with new data
    };

    if (favoriteStationsList.length > 0) {
      updatedFavoriteRealTimeData(); // Initial fetch for favorite stations
      const interval = setInterval(updatedFavoriteRealTimeData, 600000000);

      return () => clearInterval(interval); // Clean up interval when the component unmounts
    }
  }, [favoriteStationsList]);

  console.log("favoritelist:", favoriteArrivalData);
  console.log("stationName", stationName);

  return (
    <div className="w-full my-[0] mx-auto px-[20px] sm:px-[30px] md:px-[150px] lg:px-[190px] bg-[#F5F5F5] min-h-[calc(100vh-131px)]">
      {/* SEARCH ENGINE */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative py-[20px]">
          <img
            src={SearchIcon}
            height={22}
            width={22}
            alt="Search Icon"
            className="absolute top-1/2 -translate-y-1/2 left-[8px]"
          />
          <input
            className="h-[40px] w-full border-solid border-2 border-gray-200 rounded-lg pl-[35px] focus:outline-[#94afe9]"
            onChange={handleTypeSearchStation}
            value={station}
            type="text"
            placeholder="Search stations..."
          />
        </div>
        {showResultBoard && (
          <ul className="border absolute top-[70px] max-h-[300px] w-full flex flex-col overflow-y-auto bg-white rounded-[8px] z-[9999]">
            {typedStationsList?.length > 0
              ? typedStationsList?.map((station) => (
                  <li
                    onClick={() =>
                      submitSearchTerm(station?.uid, station?.name)
                    } // On click, pass the station data
                    className="cursor-pointer hover:bg-blue-100 list-none border-b last:border-0 py-[15px] pl-[35px] pr-[20px]"
                    key={station.id}
                  >
                    <p>{station.name}</p>
                  </li>
                ))
              : station && (
                  <p className="border-b last:border-0 py-[15px] pl-[35px] pr-[20px]">
                    No stations found.
                  </p>
                )}
          </ul>
        )}
      </div>

      {/* SEARCH RESULT BOARD */}
      <div className="">
        {station ? (
          <div>
            {sortedStationData.length > 0 ? (
              <div className="flex flex-col gap-[10px] mb-[87px]">
                <p className="uppercase text-center sm:text-start pb-[20px] sm:pb-[10px] color-[#4B5563] font-[700]">
                  {station} tube arrivals
                </p>

                {/* Filter By Line */}
                <ul className="flex flex-col gap-[35px] sm:gap-[25px]">
                  {LineData.map((line, index) => {
                    const filteredData = filterByLine(
                      line.name,
                      sortedStationData
                    );
                    if (filteredData.length === 0) return null;

                    const lineColor = getLineColor(line.name);
                    return (
                      <div key={index} className="">
                        <div className="flex flex-col">
                          {/* Line Name */}
                          <p className=" pl-[5px] sm:pl-[0] font-[700] text-[16px] pb-[10px]">
                            {line.name}
                          </p>
                          <ul className="flex flex-col gap-[15px]">
                            {filteredData.map((arrival: any, index: number) => {
                              const expectedArrivalTime =
                                getExpectedArrivalTime(arrival.expectedArrival);
                              return (
                                <li
                                  key={index}
                                  className="flex justify-between px-[15px] bg-white rounded-[13px] p-[10px] min-w-[250px]"
                                >
                                  <div className="flex  flex-col">
                                    <div className="flex relative justify-start">
                                      <div className="flex relative">
                                        <div
                                          className="flex absolute top-1/2 -translate-y-1/2 w-[8px] h-[8px] sm:w-[11px] sm:h-[11px] rounded-[50%]"
                                          style={{ backgroundColor: lineColor }}
                                        ></div>
                                        <p className="text-[13px] sm:text-[14px] font-[700] pl-[13px] sm:pl-[19px]">
                                          {stationName} - {arrival.towards}
                                        </p>
                                      </div>
                                      <p className="text-[14px] font-[700] pl-[19px]"></p>
                                    </div>
                                    <p className="text-[13px] sm:text-[14px]">
                                      {expectedArrivalTime} |{" "}
                                      {arrival.platformName}
                                    </p>
                                    {/* <p>Direction: {arrival.direction}</p> */}
                                  </div>
                                  <div className="flex justify-center items-center">
                                    {/* Favorite save button */}
                                    <button
                                      onClick={() =>
                                        addNewFavoriteStation(
                                          arrival.id,
                                          arrival.naptanId,
                                          arrival.stationName,
                                          arrival.lineId,
                                          arrival.lineName,
                                          arrival.platformName,
                                          arrival.towards
                                        )
                                      }
                                      className="text-[10px] w-[40px] h-full md:w-[65px] md:text-[12px] rounded-[10px] border hover:bg-[#2562EB] hover:text-white  ease-in-out duration-200"
                                    >
                                      Save
                                      {/* <img
                                        src={FavouriteIcon}
                                        width={24}
                                        height={24}
                                        alt="Favourite"
                                        className=""
                                      /> */}
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p>No arrivals data available</p>
            )}
          </div>
        ) : (
          <p></p>
        )}
      </div>

      <hr />
      <br />
      {/* FAVORITE BOARD */}
      <div>
        {sortedStationData.length > 0 ? (
          <div className="flex flex-col gap-[10px] mb-[87px]">
            <p className="uppercase text-center sm:text-start pb-[20px] sm:pb-[10px] color-[#4B5563] font-[700]">
              Favorite Stations
            </p>

            {/* Filter By Line */}
            <ul className="flex flex-col flex-wrap sm:flex-row gap-[10px] sm:gap-[15px] ">
              {favoriteArrivalData.map((arrival, index) => {
                // const expectedArrivalTime = getExpectedArrivalTime(
                //   arrival.expectedArrival
                // );
                const lineColor = getLineColor(arrival.lineName); // Get the line color for each station

                return (
                  <div key={index}>
                    <div className="flex flex-col">
                      <ul className="flex flex-col gap-[15px]">
                        <li
                          onClick={() =>
                            submitSearchTerm(
                              arrival?.naptanId,
                              arrival?.stationName.replace(
                                "Underground Station",
                                ""
                              )
                            )
                          }
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
                            <div className="bg-white">
                              {/* Optionally display more arrival details if needed */}
                              {/* <p className="text-[13px] sm:text-[14px]">{arrival.towards}</p>
                  <p className="text-[13px] sm:text-[14px]">{expectedArrivalTime} | {arrival.platformName}</p> */}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </ul>
          </div>
        ) : (
          <>
            <p className="uppercase text-center sm:text-start pb-[20px] sm:pb-[10px] color-[#4B5563] font-[700]">
              Favorite Stations
            </p>{" "}
            <p>Save your favorite tube stations..</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
