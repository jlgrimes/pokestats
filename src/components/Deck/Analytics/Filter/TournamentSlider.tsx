import {
  Heading,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Tournament } from '../../../../../types/tournament';
import { findTournament } from './helpers';

export const TournamentSlider = ({
  tournamentFilter,
  setTournamentFilter,
  defaultTournamentRange,
  tournaments,
}: {
  tournamentFilter: number;
  setTournamentFilter: (tournamentFilter: number) => void;
  defaultTournamentRange: number[];
  tournaments: Tournament[] | undefined;
}) => {
  const [slider, setSlider] = useState<number | undefined>();

  const findTournamentDate = (tournamentIdInt: number) =>
    tournaments?.find(({ id }) => parseInt(id) === tournamentIdInt)?.date.start;

  return (
    <Stack>
      <Slider
        defaultValue={tournamentFilter}
        min={defaultTournamentRange[0]}
        max={defaultTournamentRange[1]}
        step={1}
        onChange={(value: number) => {
          setTournamentFilter(value);
          setSlider(value);
        }}
        onChangeEnd={() => {
          setSlider(undefined);
        }}
      >
        <SliderTrack bg='red.100'>
          <SliderFilledTrack bg='tomato' />
        </SliderTrack>
        <RangeSliderThumb
          boxSize={6}
          index={0}
          defaultValue={defaultTournamentRange[0]}
        />
        <RangeSliderThumb
          boxSize={6}
          index={1}
          defaultValue={defaultTournamentRange[1]}
        />
        <RangeSliderMark
          value={slider as unknown as number}
          textAlign='center'
          bg='blue.500'
          color='white'
          mt='10'
          ml={(-150 * (slider ?? 0)) / (tournaments?.length ?? 1)}
          maxWidth='150'
          height='100'
          zIndex={50}
        >
          {slider ? findTournamentDate(slider) : null}
        </RangeSliderMark>
      </Slider>
      <Heading>{findTournament(tournamentFilter, tournaments)?.name}</Heading>
    </Stack>
  );
};
