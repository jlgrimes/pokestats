import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from '@chakra-ui/react';

export const DeckFilterBody = ({
  tournamentFilter,
  setTournamentFilter,
  defaultTournamentRange,
}: {
  tournamentFilter: number[];
  setTournamentFilter: (tournamentFilter: number[]) => void;
  defaultTournamentRange: number[];
}) => {
  return (
    <RangeSlider
      defaultValue={tournamentFilter}
      min={defaultTournamentRange[0]}
      max={defaultTournamentRange[1]}
      step={1}
      onChangeEnd={(value: number[]) => setTournamentFilter(value)}
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
    </RangeSlider>
  );
};
