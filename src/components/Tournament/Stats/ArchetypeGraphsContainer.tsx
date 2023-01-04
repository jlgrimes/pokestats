import {
  FormControl,
  FormLabel,
  Heading,
  SimpleGrid,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ArchetypeGraph } from './ArchetypeGraph';
import { ArchetypeBarGraph } from './ArchetypeBarGraph';
import { Tournament } from '../../../../types/tournament';

export const ArchetypeGraphsContainer = ({
  tournament,
}: {
  tournament: Tournament;
}) => {
  const [shouldDrillDown, setShouldDrillDown] = useState(false);
  const [shouldShowPieChart, setShouldShowPieChart] = useState(true);

  return (
    <Stack padding={'0 1.5rem'}>
      <Heading color='gray.700' size={'sm'}>
        Day 2 Archetype Spread
      </Heading>
      <Stack alignItems={'center'}>
        {shouldShowPieChart ? (
          <ArchetypeGraph
            tournament={tournament}
            shouldDrillDown={shouldDrillDown}
          />
        ) : (
          <ArchetypeBarGraph
            tournament={tournament}
            shouldDrillDown={shouldDrillDown}
          />
        )}
        <FormControl
          as={SimpleGrid}
          columns={{ base: 2, lg: 4 }}
          alignItems='center'
          maxWidth={'500px'}
        >
          <FormLabel htmlFor='show-pie-chart' mb='0'>
            Pie chart
          </FormLabel>
          <Switch
            id='show-pie-chart'
            onChange={() => setShouldShowPieChart(!shouldShowPieChart)}
            defaultChecked
          />
          <FormLabel htmlFor='archetype-drill-down' mb='0'>
            Drill down
          </FormLabel>
          <Switch
            id='archetype-drill-down'
            onChange={() => setShouldDrillDown(!shouldDrillDown)}
          />
        </FormControl>
      </Stack>
    </Stack>
  );
};
