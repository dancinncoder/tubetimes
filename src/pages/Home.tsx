import { useEffect, useRef, useState } from "react";
import { getStations } from "../api/database/supabase";
import { getStationArrivals } from "../api/tfl";
import SearchIcon from "../assets/ui/search-50.svg";
import LineData from "../json/line.json";

export type TypeStations = {
  created_at: string;
  id: number;
  lat: number;
  long: number;
  name: string;
  uid: string;
  updated_at: string;
  zone: string;
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
  // Flag to show/hide the search result list
  const [showResultBoard, setShowResultBoard] = useState<boolean>(false);
  const [searchedStationData, setSearchedStationData] = useState<
    TypeRealTimeArrival[]
  >([]);
  const CACHE_EXPIRY = 2592000000; // 1 month

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchIntervalRef = useRef<number | undefined>(undefined);

  const fetchStationsData = async (): Promise<TypeStations[]> => {
    try {
      const cachedStations = localStorage.getItem("stations");
      if (cachedStations) {
        return JSON.parse(cachedStations);
      }
      const stationsResponse = await getStations();
      localStorage.setItem("stations", JSON.stringify(stationsResponse));
      localStorage.setItem("stations_last_updated", Date.now().toString());
      return stationsResponse;
    } catch (error) {
      console.error("Failed to fetch stations data:", error);
      return [];
    }
  };

  const isCachedStationsExpired = (): boolean => {
    const lastUpdated = localStorage.getItem("stations_last_updated");
    if (!lastUpdated) return true;

    const lastUpdatedTimestamp = Number(lastUpdated);
    return isNaN(lastUpdatedTimestamp)
      ? true
      : Date.now() - lastUpdatedTimestamp > CACHE_EXPIRY;
  };

  const fetchStationsWithExpiry = async (): Promise<TypeStations[]> => {
    if (!isCachedStationsExpired()) {
      const cachedStations = localStorage.getItem("stations");
      if (cachedStations) {
        return JSON.parse(cachedStations);
      }
    }
    return fetchStationsData();
  };

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
    const stationsString = localStorage.getItem("stations");
    const stations = stationsString ? JSON.parse(stationsString) : [];
    const station = stations.find((station: any) => station.uid === uid);

    return station ? station.name : null;
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
          return;
        }
      } catch (error) {
        console.error("Error fetching station data:", error);
      }
    };

    fetchData(uid);
    const stationName = getStationName(uid);
    setStationName(stationName);
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
    getSearchedStationData(clickedStationUid);
    setStation(clickedStationName);
    setShowResultBoard(false);

    // After the choice of station, start to fetch data every 1 minute
    startFetchingDataEveryMinute(clickedStationUid);
  };

  const getLineColor = (lineName: string) => {
    const line = LineData.find((line) => line.name === lineName);
    return line ? line.color : "#000000"; // Black as default
  };

  const getExpectedArrivalTime = (timestamp: string) => {
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
      const stationsData = await fetchStationsWithExpiry();
      setStations(stationsData); // Load all stations into state
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
              ? typedStationsList?.map((s) => (
                  <li
                    onClick={() => submitSearchTerm(s?.uid, s?.name)} // On click, pass the station data
                    className="cursor-pointer hover:bg-blue-100 list-none border-b last:border-0 py-[15px] pl-[35px] pr-[20px]"
                    key={s.id}
                  >
                    <p>{s.name}</p>
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

      {/* SEARCH BOARD */}
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
                          {/* 라인명 */}
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
                                  className="px-[15px] bg-white rounded-[13px] p-[10px] min-w-[250px]"
                                >
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
    </div>
  );
}

export default Home;
