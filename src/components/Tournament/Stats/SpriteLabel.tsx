import { PieLabelRenderProps } from 'recharts';
import { DeckArchetype } from '../../../../types/tournament';
import { getLowResUnownUrl } from '../../common/helpers';
import { getArchetypeKey } from './helpers';

export const SpriteLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
  imageUrls,
  shouldDrillDown,
  data
}: PieLabelRenderProps & {
  imageUrls: Record<string, string>;
  shouldDrillDown: boolean;
  data: DeckArchetype[] | undefined;
}) => {
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
        id={`sprite-${name}`}
        className='pixel-image'
        height={definedPokemon ? height : 100}
        href={
          definedPokemon ? imageUrls?.[definedPokemon[0]] : getLowResUnownUrl()
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
