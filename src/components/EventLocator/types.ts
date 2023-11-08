import { IProvidedProps } from "google-maps-react";

export interface EventMapProps extends IProvidedProps {}

export interface MapCenter {
  lng: number;
  lat: number;
}