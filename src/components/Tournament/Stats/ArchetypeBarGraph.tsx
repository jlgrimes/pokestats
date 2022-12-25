import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
  BarChart,
  Bar,
  YAxis,
  XAxis,
} from 'recharts';
import { useDay2Decks } from '../../../hooks/day2decks';
import { getArchetypeGraphData, getArchetypeKey } from './helpers';
import { useState } from 'react';
import { useHighResImageUrls } from '../../../hooks/highResImages';
import { HIGH_RES_SUBSTITUTE_URL } from '../../common/helpers';

export const ArchetypeBarGraph = ({
  tournament,
  shouldDrillDown,
}: {
  tournament: { id: string; name: string };
  shouldDrillDown: boolean;
}) => {
  const { data } = useDay2Decks(tournament.id);
  const imageUrls = useHighResImageUrls(
    data?.reduce(
      (acc: string[], deck: Record<string, any>) => [
        ...acc,
        ...(deck.defined_pokemon ?? []),
      ],
      []
    )
  );

  const getRadiusScale = (percent: number, index: number) => {
    if (percent > 0.1) {
      return 1.25;
    } else if (percent > 0.04) {
      return 1.5;
    } else {
      return index % 2 ? 2 : 1.6;
    }
  };

  const getImageHeight = (percent: number) => {
    if (percent > 0.1) {
      if (shouldDrillDown) {
        return 80;
      } else {
        return 100;
      }
    } else if (percent > 0.03) {
      if (shouldDrillDown) {
        return 50;
      } else {
        return 70;
      }
    } else {
      return 30;
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    percent,
    index,
    name,
  }: PieLabelRenderProps) => {
    const x = 0;
    const y = index * 10;

    const definedPokemon = data.find(
      (deck: Record<string, any>) =>
        name === getArchetypeKey(deck, shouldDrillDown)
    )?.defined_pokemon;

    const height = getImageHeight(percent as number);

    return (
      <>
        <image
          height={definedPokemon ? height : 30}
          href={
            definedPokemon
              ? imageUrls?.[definedPokemon[0]]
              : HIGH_RES_SUBSTITUTE_URL
          }
          x={x - height / 2}
          y={y - height / 2}
        />
        {shouldDrillDown && (
          <image
            height={height * 0.75}
            href={definedPokemon ? imageUrls?.[definedPokemon[1]] : ''}
            x={x}
            y={y - height / 4}
          />
        )}
      </>
    );
  };

  return (
    <ResponsiveContainer width={350}>
      <BarChart
        data={getArchetypeGraphData(data, shouldDrillDown)}
        layout='vertical'
        reverseStackOrder
      >
        <Bar dataKey='value' fill='#8884d8' />
        <XAxis type='number' dataKey='value' />
      </BarChart>
    </ResponsiveContainer>
  );
};
