import {
  Heading,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Tournament } from '../../../../../types/tournament';
import { findTournament } from './helpers';

export const DateRangeSlider = ({
  tournamentFilter,
  setTournamentFilter,
  defaultTournamentRange,
  tournaments,
}: {
  tournamentFilter: number[];
  setTournamentFilter: (tournamentFilter: number[]) => void;
  defaultTournamentRange: number[];
  tournaments: Tournament[] | undefined;
}) => {
  const [startSlider, setStartSlider] = useState<number | undefined>();
  const [endSlider, setEndSlider] = useState<number | undefined>();

  return (
    <Stack>
      <RangeSlider
        value={defaultTournamentRange}
        min={defaultTournamentRange[0]}
        max={defaultTournamentRange[1]}
        step={1}
        onChange={(value: number[]) => {
          setTournamentFilter(value);
          if (value[0] !== tournamentFilter[0]) {
            setStartSlider(value[0]);
          } else if (value[1] !== tournamentFilter[1]) {
            setEndSlider(value[1]);
          }
        }}
        onChangeEnd={(value: number[]) => {
          setStartSlider(undefined);
          setEndSlider(undefined);
        }}
      >
        <RangeSliderTrack bg='red.100'>
          <RangeSliderFilledTrack bg='tomato' />
        </RangeSliderTrack>
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
          value={(startSlider ?? endSlider) as unknown as number}
          textAlign='center'
          bg='blue.500'
          color='white'
          mt='10'
          ml={
            (-150 * (startSlider ?? endSlider ?? 0)) /
            (tournaments?.length ?? 1)
          }
          maxWidth='150'
          height='100'
          zIndex={50}
        >
          {startSlider
            ? findTournament(startSlider, tournaments)?.name
            : endSlider
            ? findTournament(endSlider, tournaments)?.name
            : null}
        </RangeSliderMark>
      </RangeSlider>
      ƒ
      <Heading>
        {findTournament(tournamentFilter[0], tournaments)?.date.start} -{' '}
        {findTournament(tournamentFilter[1], tournaments)?.date.end}
      </Heading>
    </Stack>
  );
};
