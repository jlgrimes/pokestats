import { Flex, Image, Stack, StackItem } from '@chakra-ui/react';
import { usePokedex } from '../../hooks/images';
import { NotVerifiedIcon, VerifiedIcon } from '../Player/Icons';
import { getRegionFlag, getSpriteUrl, removeRegionFlag } from './helpers';

interface SpriteDisplayProps {
  pokemonNames: string[];
  verified?: boolean;
  squishWidth?: boolean;
}

export default function SpriteDisplay(props: SpriteDisplayProps) {
  const { data: pokedex } = usePokedex();

  return (
    <Stack
      direction='row'
      alignItems={'baseline'}
      spacing={-0.5}
      minWidth={props.squishWidth ? 0 : '4.5rem'}
    >
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
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
            <StackItem
              width='30px'
              key={idx}
              display='flex'
              justifyContent={'center'}
            >
              <Image
                className='pixel-image'
                maxHeight='30px'
                height='auto'
                width='auto'
                src={getSpriteUrl(
                  removeRegionFlag(name).toLowerCase(),
                  getRegionFlag(name)
                )}
                alt={name}
              />
            </StackItem>
          );
        })}
      </Stack>
      {props.verified !== undefined && (
        <StackItem>
          {props.pokemonNames &&
            props.pokemonNames[0] &&
            props.pokemonNames[0].length > 0 &&
            props.pokemonNames[0] !== 'substitute' &&
            (props.verified ? (
              <VerifiedIcon subtle />
            ) : (
              <NotVerifiedIcon subtle />
            ))}
        </StackItem>
      )}
    </Stack>
  );
}
