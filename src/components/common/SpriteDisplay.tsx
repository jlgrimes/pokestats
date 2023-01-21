import {
  Flex,
  Icon,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
  StackItem,
  Tooltip,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaRegEyeSlash } from 'react-icons/fa';
import { NotVerifiedIcon, VerifiedIcon } from '../Player/Icons';
import {
  getLowResUnownUrl,
  getRegionFlag,
  getSpriteUrl,
  removeRegionFlag,
} from './helpers';

interface SpriteDisplayProps {
  pokemonNames?: string[];
  deckId?: number;
  hidden?: boolean;
  verified?: boolean;
  squishWidth?: boolean;
  big?: boolean;
}

const Sprites = (props: SpriteDisplayProps & { deckIsReal: boolean }) => (
  <Stack
    direction='row'
    alignItems={'baseline'}
    spacing={-0.5}
    minWidth={props.squishWidth ? 0 : '4.61rem'}
  >
    <Stack direction={'row'} spacing={1} alignItems={'center'}>
      {!props.pokemonNames || props.pokemonNames.length === 0 ? (
        <Flex justifyContent={'center'}>
          <Image height='30px' src={getLowResUnownUrl()} alt='Unown' />
        </Flex>
      ) : props.hidden ? (
        <Flex justifyContent={'center'} minWidth='2rem'>
          <Icon as={FaRegEyeSlash} />
        </Flex>
      ) : (
        props.pokemonNames?.map((name, idx) => {
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
        })
      )}
    </Stack>
    {props.verified !== undefined && (
      <StackItem>
        {props.deckIsReal &&
          (props.verified ? (
            <VerifiedIcon subtle />
          ) : (
            <NotVerifiedIcon subtle />
          ))}
      </StackItem>
    )}
  </Stack>
);

export default function SpriteDisplay(props: SpriteDisplayProps) {
  const deckIsReal =
    props.pokemonNames &&
    props.pokemonNames[0] &&
    props.pokemonNames[0].length > 0 &&
    props.pokemonNames[0] !== 'substitute';

  if (props.hidden) {
    return <Sprites {...props} deckIsReal={false} />;
  }

  if (deckIsReal && props.deckId) {
    return (
      <LinkBox>
        <LinkOverlay as={NextLink} href={`/decks/${props.deckId}`}>
          <Sprites {...props} deckIsReal />
        </LinkOverlay>
      </LinkBox>
    );
  }

  return <Sprites {...props} deckIsReal={false} />;
}
