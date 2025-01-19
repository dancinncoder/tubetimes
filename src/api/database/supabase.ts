import { supabase } from "./supabase-config";

// GET STATION LIST FROM DATABASE
export async function getStations() {
  const { data, error } = await supabase.from("stations").select();

  if (error || null) {
    console.error("An error occured while fetching stations data", error);
    throw new Error("An error occured while fetching stations data");
  }
  return data;
}

// SUBSCRIBE TO CHANGES IN THE 'ARRIVAL' TABLE
export async function subscribeArrivalsTable(callback: (payload: any) => void) {
  const arrivalsChannel = supabase
    .channel("arrivals")
    .on(
      "postgres_changes",
      {
        event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
        schema: "public",
        table: "arrivals",
      },
      callback // Trigger the callback function passed from the caller
    )
    .subscribe((status: any) => {
      if (status === "SUBSCRIBED") {
        console.log("Successfully subscribed to changes in the arrival table.");
      } else if (
        status === "TIMED_OUT" ||
        status === "CLOSED" ||
        status === "CHANNEL_ERROR"
      ) {
        console.error("Subscription error:", status);
      }
    });

  return arrivalsChannel;
}

// ADD API ARRIVAL DATA TO DATABASE
export async function addArrival(apiData: any) {
  // try {
  //   for (const data of apiData) {
  //     if (!data.stationName) {
  //       console.error("Station name is missing in data:", data);
  //       continue;
  //     }
  //     const cleanedStationName = data.stationName
  //       .replace(/underground\s+station/i, "")
  //       .trim()
  //       .toLowerCase();
  //     if (!cleanedStationName) {
  //       console.error(
  //         "Station name is empty after removing 'underground station':",
  //         data
  //       );
  //       continue;
  //     }
  //     // 기본 키 중복 확인
  //     const { data: existingData, error: checkError } = await supabase
  //       .from("arrivals")
  //       .select("*")
  //       .eq("naptanId", data.naptanId)
  //       .eq("expectedArrival", data.expectedArrival);
  //     if (checkError) {
  //       console.error("Error checking for duplicate key:", checkError);
  //       continue;
  //     }
  //     if (existingData && existingData.length > 0) {
  //       console.log("Duplicate key found, skipping insertion:", data);
  //       continue;
  //     }
  //     // 중복이 없을 경우 삽입
  //     const { error: insertError } = await supabase
  //       .from("arrivals")
  //       .upsert(data, { onConflict: ["naptanId", "expectedArrival"] });
  //     if (insertError) {
  //       console.error("Error inserting arrival:", insertError);
  //     } else {
  //       console.log("Arrival inserted successfully:", data);
  //     }
  //   }
  // } catch (error) {
  //   console.error("Unexpected error:", error);
  // }
}
