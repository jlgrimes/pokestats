import { Flex, Image, Stack, StackItem } from '@chakra-ui/react';
import { usePokedex } from '../../hooks/images';
import { NotVerifiedIcon, VerifiedIcon } from '../Player/Icons';
import { getRegionFlag, getSpriteUrl, removeRegionFlag } from './helpers';

interface SpriteDisplayProps {
  pokemonNames: string[];
  verified?: boolean;
  squishWidth?: boolean;
  big?: boolean;
}

export default function SpriteDisplay(props: SpriteDisplayProps) {
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
                width={props.big ? '80px' : '40px'}
              />
            );
          }

          return (
            <StackItem
              width={props.big ? '60px' : '30px'}
              key={idx}
              display='flex'
              justifyContent={'center'}
            >
              <Image
                className='pixel-image'
                maxHeight={props.big ? '50px' : '30px'}
                minHeight={props.big ? '50px' : 0}
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
