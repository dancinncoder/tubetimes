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
