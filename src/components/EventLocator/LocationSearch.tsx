import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { SearchSelect, SearchSelectItem } from "@tremor/react";
import { SearchIcon } from "@heroicons/react/outline";
import Cookies from 'js-cookie';
import { EVENT_QUERY_COOKIE_KEY } from "./constants";

interface LocationSearchProps {
  setCenter: Function;
}

export const LocationSearch = (props: LocationSearchProps) => {
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
  });

  return (
    <SearchSelect className="mt-2" icon={SearchIcon} placeholder="Search a location" onKeyUp={(evt) => getPlacePredictions({ input: (evt.target as HTMLInputElement).value })}>
      {placePredictions.map((place) => <SearchSelectItem key={place.description + '-search-result'} value={place.description} onClick={() => {
        placesService?.getDetails({ placeId: place.place_id}, (a) => {
          const location = a?.geometry?.location;
          const center = { lat: location?.lat(), lng: location?.lng() };
          props.setCenter(center);
          Cookies.set(EVENT_QUERY_COOKIE_KEY, JSON.stringify(center));
        })
      }} />)}
    </SearchSelect>
  )
}