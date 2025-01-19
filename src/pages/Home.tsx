import { useEffect, useState } from "react";
import {
  addArrival,
  getStations,
  subscribeArrivalsTable,
} from "../api/database/supabase";
import { getStationArrivals } from "../api/tfl";

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

  useEffect(() => {
    const fetchData = async () => {
      const stationsData = await fetchStationsWithExpiry();
      setStations(stationsData); // Load all stations into state
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // A CALLBACK THAT SETUPS SUBSCRIBTION AND HANDLES NEW DATA AS IT COMES IN
  useEffect(() => {
    const handleArrivalDataChange = (payload: any) => {
      console.log("New data received in arrival table:", payload);
      // 새로운 데이터가 들어올 때마다 상태 업데이트
      setSearchedStationData((prevData) => [...prevData, payload.new]); // payload.new에서 실시간 데이터를 추출
    };

    const startSubscription = async () => {
      const channel = await subscribeArrivalsTable(handleArrivalDataChange);

      // Clean up
      return () => {
        if (channel) {
          channel.unsubscribe();
        }
      };
    };

    startSubscription();
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

  //FILTER ARRIVAL DATA FROM API
  const filterArrival = async (apiData: any) => {
    console.log("Received apiData in filterArrival:", apiData);

    if (!apiData || apiData.length === 0) {
      console.error("apiData is undefined, null, or empty");
      return null;
    }

    // To process multiple pieces of data, traverse an array
    const filteredDataArray = apiData.map((item: TypeRealTimeArrival) => {
      const {
        id,
        naptanId,
        stationName,
        lineId,
        lineName,
        platformName,
        towards,
        destinationNaptanId,
        destinationName,
        timeToStation,
        expectedArrival,
      } = item;

      return {
        id,
        naptanId,
        stationName,
        lineId,
        lineName,
        platformName,
        towards,
        destinationNaptanId,
        destinationName,
        timeToStation,
        expectedArrival,
      };
    });

    console.log("filteredDataArray:", filteredDataArray);
    return filteredDataArray;
  };

  // GET ARRIVAL DATA EVERY 1MINUTE FROM API, SAVE THEM IN DATABASE
  const getSearchedStationData = (uid: string) => {
    const fetchData = async (uid: string) => {
      try {
        // Get arrival data from tfl api
        const stationArrivalData = await getStationArrivals(uid);
        console.log("tfl stationArrivalData:", stationArrivalData);

        if (!stationArrivalData || stationArrivalData.length === 0) {
          console.error("No data returned from TFL API for station:", uid);
          return;
        }

        // Save data in database
        const data = await filterArrival(stationArrivalData);

        console.log("data before addArrival", data);
        await addArrival(data);

        console.log("Arrival data added to database.");
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
    }, 60000); // 60000ms = 1분
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
    <div>
      <h1>Home</h1>
      {/* SEARCH ENGINE */}
      <div>
        <input
          className="border-solid border-2 border-gray-200 rounded-lg"
          onChange={handleTypeSearchStation}
          value={station}
          type="text"
          placeholder="Search stations..."
        />
        {isLoading ? (
          <p>Loading stations...</p>
        ) : (
          showResultBoard && (
            <ul>
              {
                typedStationsList.length > 0
                  ? typedStationsList.map((s) => (
                      <li
                        onClick={() => submitSearchTerm(s?.uid, s?.name)} // On click, pass the station data
                        className="cursor-pointer hover:bg-blue-100 list-none"
                        key={s.id}
                      >
                        <p>{s.name}</p>
                      </li>
                    ))
                  : station && <p>No stations found.</p> // Show only if there's a search term
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
