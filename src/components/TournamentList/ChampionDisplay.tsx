import { Standing } from '../../../types/tournament';
import SpriteDisplay from '../common/SpriteDisplay/SpriteDisplay';

interface ChampionDisplayProps {
  champion: Standing;
}

export const ChampionDisplay = (props: ChampionDisplayProps) => {

  return (
    <SpriteDisplay pokemonNames={props.champion.deck_archetype?.defined_pokemon} />
  );
};
