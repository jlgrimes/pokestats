import { Flex, Icon, Image, Stack, StackItem } from '@chakra-ui/react';
import { memo } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa';
import { VerifiedIcon } from '../../Player/Icons';
import { getLowResUnownUrl } from '../helpers';
import { SingleSprite } from './SingleSprite';
import { SpritesProps } from './SpriteDisplayProps';

export const Sprites = memo((props: SpritesProps) => {
  const names =
    (props.shouldBlurSecondSprite && props.pokemonNames)
      ? [props.pokemonNames[0]]
      : props.pokemonNames;

  return (
    <Stack
      direction='row'
      alignItems={'baseline'}
      spacing={-0.5}
      minWidth={props.squishWidth ? 0 : '4.6rem'}
    >
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        {props.hidden ? (
          <Flex justifyContent={'center'} minWidth='2rem'>
            <Icon as={FaRegEyeSlash} />
          </Flex>
        ) : (!props.pokemonNames || props.pokemonNames.length === 0) ? (
          <Flex justifyContent={'center'}>
            <Image
              height='30px'
              src={getLowResUnownUrl()}
              alt='Unown'
              className='pixel-image'
              transform={'scale(1.5)'}
            />
          </Flex>
        ) : (
          names?.map((name, idx) => (
            <SingleSprite
              big={props.big}
              name={name}
              key={Math.random()}
              shouldBlur={props.shouldBlurSecondSprite && idx === 1}
            />
          ))
        )}
      </Stack>
      {props.verified !== undefined && (
        <StackItem>
          {!props.shouldHideVerification && props.verified && (
            <VerifiedIcon subtle />
          )}
        </StackItem>
      )}
    </Stack>
  );
});

Sprites.displayName = 'Sprites';
