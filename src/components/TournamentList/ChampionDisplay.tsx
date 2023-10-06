import { Standing } from '../../../types/tournament';
import SpriteDisplay from '../common/SpriteDisplay/SpriteDisplay';

interface ChampionDisplayProps {
  champion: Standing;
}

export const ChampionDisplay = (props: ChampionDisplayProps) => {
  if (!props.champion.defined_pokemon) return null;

  return (
    <SpriteDisplay pokemonNames={props.champion.defined_pokemon} />
  );
};
