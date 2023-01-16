import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';

export const DeckFilterBody = () => {
  return (
    <Slider defaultValue={60} min={0} max={300} step={30}>
      <SliderTrack bg='red.100'>
        <Box position='relative' right={10} />
        <SliderFilledTrack bg='tomato' />
      </SliderTrack>
      <SliderThumb boxSize={6} />
    </Slider>
  );
};
