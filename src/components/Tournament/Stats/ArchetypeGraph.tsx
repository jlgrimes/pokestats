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
    const radiusScale = 1.25;
    const x =
      (cx as number) + radius * radiusScale * Math.cos(-midAngle * RADIAN);
    const y =
      (cy as number) + radius * radiusScale * Math.sin(-midAngle * RADIAN);

    const definedPokemon = data.find(
      (deck: Record<string, any>) => name === deck.name
    ).defined_pokemon;

    return (
      <>
        <image href={getSpriteUrl(definedPokemon[0])} x={x - 20} y={y} />
        <image href={getSpriteUrl(definedPokemon[1])} x={x + 20} y={y} />
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
