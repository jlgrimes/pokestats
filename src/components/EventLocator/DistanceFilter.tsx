import { Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack } from "@chakra-ui/react";
import Cookies from 'js-cookie';
import { EVENT_DISTANCE_SLIDER_COOKIE_KEY, EVENT_QUERY_COOKIE_KEY } from "./constants";

interface DistanceFilterProps {
  maxDistance: number;
  setMaxDistance: Function;
}

const labelStyles = {
  mt: '2',
  ml: '-2.5',
  fontSize: 'sm',
}

export const DistanceFilter = (props: DistanceFilterProps) => {
  return (
    <Slider aria-label='slider-ex-6' onChange={(val) => console.log(val)} min={5} max={250} defaultValue={props.maxDistance} onChangeEnd={(value) => {
      props.setMaxDistance(value);
      Cookies.set(EVENT_DISTANCE_SLIDER_COOKIE_KEY, value.toString())
    }}>
      <SliderMark value={5}  {...labelStyles}>
        5 mi
      </SliderMark>
      <SliderMark value={100}  {...labelStyles}>
        100 mi
      </SliderMark>
      <SliderMark value={205}  {...labelStyles}>
        250 mi
      </SliderMark>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  )
}