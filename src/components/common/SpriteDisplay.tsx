import { Flex, Image, Stack } from '@chakra-ui/react';
import { usePokedex } from '../../hooks/highResImages';
import { getRegionFlag, getSpriteUrl, removeRegionFlag } from './helpers';

interface SpriteDisplayProps {
  pokemonNames: string[];
}

export default function SpriteDisplay(props: SpriteDisplayProps) {
  const { data: pokedex } = usePokedex();

  return (
    <Stack direction={'row'} spacing={1}>
      {props.pokemonNames.map((name, idx) => {
        if (!name || name.length === 0) return;

        return (
          <Image
            key={idx}
            src={getSpriteUrl(pokedex?.[removeRegionFlag(name).toLowerCase()], getRegionFlag(name))}
            alt={name}
            maxHeight='30px'
            width='auto'
          />
        );
      })}
    </Stack>
  );
}
