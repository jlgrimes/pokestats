import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';

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
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const radiusScale = 1.25;
    const x = cx + radius * radiusScale * Math.cos(-midAngle * RADIAN) - 20;
    const y = cy + radius * radiusScale * Math.sin(-midAngle * RADIAN);
    console.log(data[index]);

    return (
      <>
        <image
          href={getSpriteUrl(
            data.find(deck => name === deck.name).defined_pokemon[0]
          )}
          x={x}
          y={y}
          fill='white'
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'
        />
        <image
          href={getSpriteUrl(
            data.find(deck => name === deck.name).defined_pokemon[1]
          )}
          x={x + 40}
          y={y}
          fill='white'
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'
        />
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
