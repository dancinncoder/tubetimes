// https://api.tfl.gov.uk/stopPoint/{id}/arrivals
// https://api.tfl.gov.uk/line/victoria/arrivals

import axios from "axios";

const appKey = import.meta.env.VITE_APP_KEY;

// line data test
export const getLineArrivals = async () => {
  try {
    const response = await axios.get(
      "https://api.tfl.gov.uk/line/victoria/arrivals",
      {
        params: {
          app_key: appKey,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching line arrivals:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    return [];
  }
};

export const getStationArrivals = async () => {
  try {
    const response = await axios.get(
      "https://api.tfl.gov.uk/stopPoint/490005183E/arrivals",
      {
        params: {
          app_key: appKey,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching station arrivals:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    return [];
  }
};
