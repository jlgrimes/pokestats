import {
  FormControl,
  FormLabel,
  Heading,
  Show,
  SimpleGrid,
  Stack,
  Switch,
  Text,
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

  return (
    <Stack padding={'0 1.5rem'} height='100%'>
      <Stack
        alignItems={'center'}
        direction={{ base: 'column', md: 'row' }}
        spacing={0}
        height='100%'
      >
        {shouldToggleShowPieChart && (
          <ArchetypeGraph
            tournament={tournament}
            shouldDrillDown={shouldDrillDown}
            shouldShowUnreported={shouldShowUnreported}
          />
        )}
        <Show above='md'>
          <ArchetypeBarGraph
            tournament={tournament}
            shouldDrillDown={shouldDrillDown}
            shouldShowUnreported={shouldShowUnreported}
          />
        </Show>
      </Stack>
      <Stack padding='2rem 0'>
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
      </Stack>
      {!shouldShowUnreported && (
        <Text as='b' color='red.600'>
          Data does not include unreported decks
        </Text>
      )}
    </Stack>
  );
};
