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
import { getArchetypeGraphData } from './helpers';

export const ArchetypeGraph = ({
  tournament,
}: {
  tournament: { id: string; name: string };
}) => {
  const { data } = useDay2Decks(tournament.id);

  const getRadiusScale = (percent: number) => {
    if (percent > 0.1) {
      return 1.25;
    } else if (percent > 0.05) {
      return 1.75
    } else {
      return 2;
    }
  }

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
    const radiusScale = getRadiusScale(percent as number);
    const x =
      (cx as number) + radius * radiusScale * Math.cos(-midAngle * RADIAN) - 10;
    const y =
      (cy as number) + radius * radiusScale * Math.sin(-midAngle * RADIAN) - 20;

    const definedPokemon = data.find(
      (deck: Record<string, any>) => name === deck.name
    ).defined_pokemon;

    return (
      <>
        <image width={(percent as number) > 0.1 ? 50 : 35} href={getSpriteUrl(definedPokemon[0])} x={x} y={y} />
      </>
    );
  };

  return (
    <PieChart width={400} height={400}>
      <Pie
        dataKey='value'
        isAnimationActive={false}
        data={getArchetypeGraphData(data)}
        cx='50%'
        cy='50%'
        labelLine={false}
        label={renderCustomizedLabel}
        fill='#8884d8'
      />
      <Tooltip />
    </PieChart>
  );
};
