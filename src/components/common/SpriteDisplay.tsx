import { Flex, Image, Stack, StackItem } from '@chakra-ui/react';
import { usePokedex } from '../../hooks/images';
import { getRegionFlag, getSpriteUrl, removeRegionFlag } from './helpers';

interface SpriteDisplayProps {
  pokemonNames: string[];
}

export default function SpriteDisplay(props: SpriteDisplayProps) {
  const { data: pokedex } = usePokedex();

  return (
    <Stack direction={'row'} spacing={1} minWidth='4.5rem' alignItems={'center'}>
      {props.pokemonNames.map((name, idx) => {
        if (name.length === 0) return;

        if (name === 'substitute') {
          return (
            <Image
              className='pixel-image'
              key={idx}
              src='https://archives.bulbagarden.net/media/upload/a/a5/SubstituteG5f.png'
              alt='Other'
              height='auto'
              width='40px'
            />
          );
        }

        return (
          <StackItem width='30px' key={idx} display='flex' justifyContent={'center'}>
            <Image
              className='pixel-image'
              maxHeight='30px'
              height='auto'
              width='auto'
              src={getSpriteUrl(removeRegionFlag(name).toLowerCase(),
                getRegionFlag(name)
              )}
              alt={name}
            />
          </StackItem>
        );
      })}
    </Stack>
  );
}
