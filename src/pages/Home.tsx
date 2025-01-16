import { useEffect, useState } from "react";
import { getStations } from "../api/database/supabase";
// import { getLineArrivals, getStationArrivals } from "../api/tfl";

function Home() {
  // Tfl Api call test
  // const [lineArrivals, setLineArrivals] = useState([]);
  // const [stationArrivals, setStationArrivals] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const lineArrivalData = await getLineArrivals();
  //     const stationArrivalDAta = await getStationArrivals();
  //     setLineArrivals(lineArrivalData);
  //     setStationArrivals(stationArrivalDAta);
  //   };

  //   fetchData();
  // }, []);
  // console.log("line arrivals data:", lineArrivals);
  // console.log("station arrivals data:", stationArrivals);

  const [stations, setStations] = useState();
  const CACHE_EXPIRY = 2592000000; // 1 month

  useEffect(() => {
    const fetchData = async () => {
      // Check initially if the stations data is expired
      const stationsData = await fetchStationsWithExpiry();
      setStations(stationsData);
    };

    fetchData();
  }, []);

  // CACHE STATIONS DATA
  const fetchStationsData = async () => {
    const cachedStations = localStorage.getItem("stations");
    if (cachedStations) {
      return JSON.parse(cachedStations);
    }

    // If no cached data, fetch from the API
    const stationsResponse = await getStations();
    localStorage.setItem("stations", JSON.stringify(stationsResponse));
    localStorage.setItem("stations_last_updated", Date.now().toString()); // Update the timestamp
    return stationsResponse; // Return the fetched data
  };

  // UPDATE EXPIRED STATIONS DATA
  const isCachedStationsExpired = () => {
    const lastUpdated = localStorage.getItem("stations_last_updated");
    return lastUpdated ? Date.now() - Number(lastUpdated) > CACHE_EXPIRY : true; // Check if cache has expired
  };

  const fetchStationsWithExpiry = async () => {
    if (isCachedStationsExpired()) {
      // Cache expired, fetch new data and store it
      const stationsData = await fetchStationsData();
      return stationsData;
    }

    // Cache is valid, return cached data (ensure it's not null)
    const cachedStations = localStorage.getItem("stations");
    return cachedStations ? JSON.parse(cachedStations) : []; // Return empty array if null
  };

  return (
    <div>
      <h1>Home</h1>
      <input type="text" />
      {/* <ul>
        {lineArrivals.map((lineArrival, index) => (
          <li key={index}></li>
        ))}
      </ul> */}
    </div>
  );
}

export default Home;
