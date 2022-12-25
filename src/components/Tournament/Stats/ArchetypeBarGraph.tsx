import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
  XAxis,
  LabelList,
  CartesianGrid,
} from 'recharts';
import { useDay2Decks } from '../../../hooks/day2decks';
import { useLowResImageUrls } from '../../../hooks/images';
import { LOW_RES_SUBSTITUTE_URL } from '../../common/helpers';
import SpriteDisplay from '../../common/SpriteDisplay';
import { getArchetypeGraphData, getArchetypeKey } from './helpers';

export const ArchetypeBarGraph = ({
  tournament,
  shouldDrillDown,
}: {
  tournament: { id: string; name: string };
  shouldDrillDown: boolean;
}) => {
  const { data } = useDay2Decks(tournament.id);
  const imageUrls = useLowResImageUrls(
    data?.reduce(
      (acc: string[], deck: Record<string, any>) => [
        ...acc,
        ...(deck.defined_pokemon ?? []),
      ],
      []
    )
  );

  const renderCustomizedLabel = (props: Record<string, any>) => {
    const { x, y, width, height, value } = props;
    const radius = 10;

    const definedPokemon = data.find(
      (deck: Record<string, any>) =>
        value === getArchetypeKey(deck, shouldDrillDown)
    )?.defined_pokemon;

    return (
      <g>
        <image
          height={shouldDrillDown ? 20 : 30}
          href={
            definedPokemon
              ? imageUrls?.[definedPokemon[0]]
              : LOW_RES_SUBSTITUTE_URL
          }
          x={width + 10}
          y={y - height / 2}
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width={'100%'} height={400}>
      <BarChart
        width={300}
        height={300}
        data={getArchetypeGraphData(data, shouldDrillDown)}
        layout='vertical'
        reverseStackOrder
      >
        <Bar dataKey='value' fill='#8884d8'>
          <LabelList dataKey={'name'} content={renderCustomizedLabel} />
        </Bar>

        <XAxis type='number' dataKey='value' />
        <YAxis type='category' dataKey={'name'} hide />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  );
};
