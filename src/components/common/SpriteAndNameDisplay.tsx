import { Stack } from '@chakra-ui/react';
import SpriteDisplay from './SpriteDisplay';

interface SpriteAndNameDisplayProps {
  archetypeName: string;
  pokemonNames: string[];
}

export default function SpriteAndNameDisplay(props: SpriteAndNameDisplayProps) {
  return (
    <Stack direction={'row'} alignItems={'center'}>
      <SpriteDisplay pokemonNames={props.pokemonNames} />
      <div>{props.archetypeName}</div>
    </Stack>
  );
}
