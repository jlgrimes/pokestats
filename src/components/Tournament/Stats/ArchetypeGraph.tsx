import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from 'recharts';

import { useDay2Decks } from '../../../hooks/day2decks';
import { getSpriteUrl } from '../../common/helpers';
import { getArchetypeGraphData, getArchetypeKey } from './helpers';

export const ArchetypeGraph = ({
  tournament,
}: {
  tournament: { id: string; name: string };
}) => {
  const { data } = useDay2Decks(tournament.id);
  const shouldDrillDown = false;

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
      return 50;
    } else if (percent > 0.03) {
      return 40;
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
    if (shouldDrillDown && ((percent as number) < 0.01)) {
      return;
    }

    const radius =
      (innerRadius as number) +
      ((outerRadius as number) - (innerRadius as number)) * 0.5;
    const radiusScale = getRadiusScale(percent as number, index as number);
    const x =
      (cx as number) + radius * radiusScale * Math.cos(-midAngle * RADIAN);
    const y =
      (cy as number) + radius * radiusScale * Math.sin(-midAngle * RADIAN);

    const definedPokemon = data.find(
      (deck: Record<string, any>) => name === getArchetypeKey(deck, false)
    ).defined_pokemon;

    const height = getImageHeight(percent as number);

    return (
      <>
        <image
          height={height}
          href={getSpriteUrl(definedPokemon[0])}
          x={x - height / 2}
          y={y - height / 2}
        />
      </>
    );
  };
  console.log(getArchetypeGraphData(data, false))

  return (
    <ResponsiveContainer width={'100%'} height={425}>
      <PieChart>
        <Pie
          dataKey='value'
          isAnimationActive={false}
          data={getArchetypeGraphData(data, false)}
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
  );
};
