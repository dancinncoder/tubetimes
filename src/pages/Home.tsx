import { useState, useEffect } from "react";
import { getLineArrivals, getStationArrivals } from "../api/tfl";

function Home() {
  const [lineArrivals, setLineArrivals] = useState([]);
  const [stationArrivals, setStationArrivals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const lineArrivalData = await getLineArrivals();
      const stationArrivalDAta = await getStationArrivals();
      setLineArrivals(lineArrivalData);
      setStationArrivals(stationArrivalDAta);
    };

    fetchData();
  }, []);

  console.log("line arrivals data:", lineArrivals);
  console.log("station arrivals data:", stationArrivals);

  return (
    <div>
      <h1>Home</h1>
      <ul>
        {lineArrivals.map((lineArrival, index) => (
          <li key={index}></li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
