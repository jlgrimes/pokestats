import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { SearchSelect, SearchSelectItem } from "@tremor/react";

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
    <SearchSelect onKeyUp={(evt) => getPlacePredictions({ input: (evt.target as HTMLInputElement).value })}>
      {placePredictions.map((place) => <SearchSelectItem value={place.description} onClick={() => {
        placesService?.getDetails({ placeId: place.place_id}, (a) => {
          const location = a?.geometry?.location;
          props.setCenter({ lat: location?.lat(), lng: location?.lng() });
        })
      }} />)}
    </SearchSelect>
  )
}