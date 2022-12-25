import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
  BarChart,
  Bar,
} from 'recharts';
import {
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { useDay2Decks } from '../../../hooks/day2decks';
import { getArchetypeGraphData, getArchetypeKey } from './helpers';
import { useState } from 'react';
import { ArchetypeGraph } from './ArchetypeGraph';

export const ArchetypeGraphsContainer = ({
  tournament,
}: {
  tournament: { id: string; name: string };
}) => {
  const [shouldDrillDown, setShouldDrillDown] = useState(false);

  return (
    <Stack padding={'0 1.5rem'}>
      <Heading color='gray.700' size={'sm'}>
        Day 2 Archetype Spread
      </Heading>
      <Stack alignItems={'center'}>
          <ArchetypeGraph tournament={tournament} shouldDrillDown={shouldDrillDown} />
        <div>
          <FormControl display='flex' alignItems='center'>
            <FormLabel htmlFor='archetype-drill-down' mb='0'>
              Drill down archetypes
            </FormLabel>
            <Switch
              id='archetype-drill-down'
              onChange={() => setShouldDrillDown(!shouldDrillDown)}
            />
          </FormControl>
        </div>
      </Stack>
    </Stack>
  );
};
