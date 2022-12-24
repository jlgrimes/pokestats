import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
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
import { useHighResImageUrls } from '../../../hooks/highResImages';

export const ArchetypeGraph = ({
  tournament,
}: {
  tournament: { id: string; name: string };
}) => {
  const { data } = useDay2Decks(tournament.id);
  const imageUrls = useHighResImageUrls(data?.map((deck) => deck.defined_pokemon[0]))
  const [shouldDrillDown, setShouldDrillDown] = useState(false);

  const getRadiusScale = (percent: number, index: number) => {
    if (percent > 0.1) {
      return 1.25;
    } else if (percent > 0.03) {
      return 1.5;
    } else {
      return index % 2 ? 2 : 1.6;
    }
  };

  const getImageHeight = (percent: number) => {
    if (percent > 0.1) {
      return 80;
    } else if (percent > 0.03) {
      return 50;
    } else {
      return 30;
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: PieLabelRenderProps) => {
    const radius =
      (innerRadius as number) +
      ((outerRadius as number) - (innerRadius as number)) * 0.5;
    const radiusScale = getRadiusScale(percent as number, index as number);
    const x =
      (cx as number) + radius * radiusScale * Math.cos(-midAngle * RADIAN);
    const y =
      (cy as number) + radius * radiusScale * Math.sin(-midAngle * RADIAN);

    const definedPokemon = data.find(
      (deck: Record<string, any>) =>
        name === getArchetypeKey(deck, shouldDrillDown)
    ).defined_pokemon;

    const height = getImageHeight(percent as number);

    return (
      <>
        <image
          height={height}
          href={imageUrls?.[definedPokemon[0]]}
          x={x - height / 2}
          y={y - height / 2}
        />
      </>
    );
  };

  return (
    <Stack padding={'1rem 1.5rem'}>
      <Heading color='gray.700' size={'md'}>
        Day 2 Archetype Spread
      </Heading>
      <Stack alignItems={'center'}>
        <ResponsiveContainer width={'100%'} height={425}>
          <PieChart>
            <Pie
              dataKey='value'
              isAnimationActive={false}
              data={getArchetypeGraphData(data, shouldDrillDown)}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={renderCustomizedLabel}
              fill='#8884d8'
              outerRadius={'95%'}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
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
