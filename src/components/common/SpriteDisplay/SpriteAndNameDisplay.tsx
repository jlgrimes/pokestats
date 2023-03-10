import { Stack } from '@chakra-ui/react';
import SpriteDisplay from './SpriteDisplay';

interface SpriteAndNameDisplayProps {
  archetypeName: string;
  pokemonNames: string[];
}

export default function SpriteAndNameDisplay(props: SpriteAndNameDisplayProps) {
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      width='100%'
    >
      <div>{props.archetypeName}</div>
      <SpriteDisplay pokemonNames={props.pokemonNames} />
    </Stack>
  );
}
