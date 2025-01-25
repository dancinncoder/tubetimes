import { useEffect, useRef, useState } from "react";
import { getStations } from "../api/database/supabase";
import { getStationArrivals } from "../api/tfl";
import SearchIcon from "../assets/ui/search-50.svg";

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
  const [stations, setStations] = useState<TypeStations[]>([]); // All stations data
  const [station, setStation] = useState<string>(""); // Search input
  const [typedStationsList, setTypedStationsList] = useState<TypeStations[]>(
    []
  ); // Search results for list dropdown
  const [showResultBoard, setShowResultBoard] = useState<boolean>(false); // Flag to show/hide the search result list
  const [searchedStationData, setSearchedStationData] = useState<
    TypeRealTimeArrival[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const CACHE_EXPIRY = 2592000000; // 1 month
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      setIsLoading(false);
    };

    fetchData();
  }, []);

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
    return lastUpdated ? Date.now() - Number(lastUpdated) > CACHE_EXPIRY : true;
  };

  const fetchStationsWithExpiry = async (): Promise<TypeStations[]> => {
    if (isCachedStationsExpired()) {
      return fetchStationsData();
    }
    const cachedStations = localStorage.getItem("stations");
    return cachedStations ? JSON.parse(cachedStations) : [];
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
      setShowResultBoard(true); // Show result board if there's a search term
    }
  };

  const showTypedStationsList = (searchTerm: string) => {
    const result = stations.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTypedStationsList(result);
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
  };

  // FETCH DATA EVERY 1MINUTE
  const startFetchingDataEveryMinute = (uid: string) => {
    setInterval(() => {
      getSearchedStationData(uid);
      console.log("real-time data has been updated.");
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

    // After the choice of station, start to fetch data every 1 mintue
    startFetchingDataEveryMinute(clickedStationUid);
  };

  console.log("searchedStationData:", searchedStationData);
  return (
    <div
      className="w-full my-[0] mx-auto px-[190px] bg-[#F5F5F5] min-h-[100vh]
    "
    >
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
        {isLoading ? (
          <p>Loading stations...</p>
        ) : (
          showResultBoard && (
            <ul className="border absolute top-[70px] max-h-[300px] w-full flex flex-col overflow-y-auto bg-white rounded-[8px] ">
              {
                typedStationsList.length > 0
                  ? typedStationsList.map((s) => (
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
                    ) // Show only if there's a search term
              }
            </ul>
          )
        )}
      </div>
      {/* SEARCH BOARD */}
      <div>
        {searchedStationData.length > 0 ? (
          <ul>
            {searchedStationData.map((arrival: any, index: number) => (
              <li key={index}>
                <p>Line: {arrival.lineName}</p>
                <p>Expected Arrival: {arrival.expectedArrival}</p>
                <p>Destination: {arrival.destinationName}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default Home;
