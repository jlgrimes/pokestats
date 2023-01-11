import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from 'recharts';
import { useDay2Decks } from '../../../hooks/day2decks';
import { getArchetypeGraphData, getArchetypeKey } from './helpers';
import { useHighResImageUrls, useLowResImageUrls } from '../../../hooks/images';
import {
  getLowResUnownUrl,
  HIGH_RES_SUBSTITUTE_URL,
} from '../../common/helpers';
import { DeckArchetype, Tournament } from '../../../../types/tournament';

export const ArchetypeGraph = ({
  tournament,
  shouldDrillDown,
  shouldShowUnreported,
}: {
  tournament: Tournament;
  shouldDrillDown: boolean;
  shouldShowUnreported: boolean;
}) => {
  const { data } = useDay2Decks(tournament.id);
  const imageUrls = useLowResImageUrls(
    data?.reduce(
      (acc: string[], deck: DeckArchetype) => [
        ...acc,
        ...(deck.defined_pokemon ?? []),
      ],
      []
    ) ?? []
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
        return 70;
      } else {
        return 80;
      }
    } else if (percent > 0.03) {
      if (shouldDrillDown) {
        return 50;
      } else {
        return 60;
      }
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

    const definedPokemon = data?.find(
      (deck: Record<string, any>) =>
        name === getArchetypeKey(deck, shouldDrillDown)
    )?.defined_pokemon;

    const height = getImageHeight(percent as number);

    return (
      <>
        <image
          className='pixel-image'
          height={definedPokemon ? height : 100}
          href={
            definedPokemon
              ? imageUrls?.[definedPokemon[0]]
              : getLowResUnownUrl()
          }
          x={x - height / 2}
          y={y - height / 2}
        />
        {shouldDrillDown && (
          <image
            className='pixel-image'
            height={height * 0.75}
            href={definedPokemon ? imageUrls?.[definedPokemon[1]] : ''}
            x={x}
            y={y - height / 5}
          />
        )}
      </>
    );
  };

  return (
    <ResponsiveContainer width={'100%'} height={350}>
      <PieChart>
        <Pie
          dataKey='value'
          data={getArchetypeGraphData(
            data,
            shouldDrillDown,
            shouldShowUnreported
          )}
          cx='50%'
          cy='50%'
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={'100%'}
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
