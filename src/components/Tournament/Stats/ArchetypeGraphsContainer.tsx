import {
  FormControl,
  FormLabel,
  Heading,
  Show,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ArchetypeGraph } from './ArchetypeGraph';
import { ArchetypeBarGraph } from './ArchetypeBarGraph';
import { Tournament } from '../../../../types/tournament';

export const ArchetypeGraphsContainer = ({
  tournament,
  allDay2DecksSubmitted,
}: {
  tournament: Tournament;
  allDay2DecksSubmitted: boolean;
}) => {
  const [shouldDrillDown, setShouldDrillDown] = useState(false);
  const [shouldShowUnreported, setShouldShowUnreported] = useState(true);
  const [shouldToggleShowPieChart, setShouldToggleShowPieChart] =
    useState(true);
  const [isLargerThanMd] = useMediaQuery('(min-width: 48em)');

  const shouldShowPieChart = isLargerThanMd || shouldToggleShowPieChart;
  const shouldShowBarChart = isLargerThanMd || !shouldToggleShowPieChart;

  return (
    <Stack padding={'0 1.5rem'} height='100%'>
      <Stack
        alignItems={'center'}
        direction={{ base: 'column', md: 'row' }}
        spacing={0}
        height='100%'
      >
        {shouldShowPieChart && (
          <ArchetypeGraph
            tournament={tournament}
            shouldDrillDown={shouldDrillDown}
            shouldShowUnreported={shouldShowUnreported}
          />
        )}
        {shouldShowBarChart && (
          <ArchetypeBarGraph
            tournament={tournament}
            shouldDrillDown={shouldDrillDown}
            shouldShowUnreported={shouldShowUnreported}
          />
        )}
      </Stack>
      <Stack padding='0.5rem 0'>
        <Heading color='gray.700' size={'md'}>
          Day 2 Archetype Spread
        </Heading>
        <FormControl
          as={SimpleGrid}
          gridTemplateColumns={'auto auto auto auto'}
          alignItems='center'
          maxWidth={'500px'}
        >
          <FormLabel htmlFor='archetype-drill-down' mb='0'>
            Drill down
          </FormLabel>
          <Switch
            id='archetype-drill-down'
            onChange={() => setShouldDrillDown(!shouldDrillDown)}
          />
          <Show below='md'>
            <FormLabel htmlFor='show-pie-chart' mb='0'>
              Pie chart
            </FormLabel>
            <Switch
              id='show-pie-chart'
              onChange={() =>
                setShouldToggleShowPieChart(!shouldToggleShowPieChart)
              }
              defaultChecked
            />
          </Show>
          {!allDay2DecksSubmitted && (
            <>
              <FormLabel htmlFor='show-unreported' mb='0'>
                Show unreported
              </FormLabel>
              <Switch
                defaultChecked={shouldShowUnreported}
                id='show-unreported'
                onChange={() => setShouldShowUnreported(!shouldShowUnreported)}
              />
            </>
          )}
        </FormControl>
        <Text
          as='b'
          color='red.600'
          visibility={!shouldShowUnreported ? 'visible' : 'hidden'}
        >
          Data does not include unreported decks
        </Text>
      </Stack>
    </Stack>
  );
};
