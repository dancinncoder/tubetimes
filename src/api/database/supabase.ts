import { supabase } from "./supabase-config";

export async function getStations() {
  const { data, error } = await supabase.from("stations").select();

  if (error || null) {
    console.error("An error occured while fetching stations data", error);
    throw new Error("An error occured while fetching stations data");
  }
  return data;
}
