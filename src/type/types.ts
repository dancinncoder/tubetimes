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

export type TypeFavoriteState = {
  favoriteList: TypeFavoriteStationsList[];
};
