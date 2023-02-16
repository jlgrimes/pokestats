import { Image, StackItem } from '@chakra-ui/react';
import { memo } from 'react';
import { getRegionFlag, getSpriteUrl, removeRegionFlag } from '../helpers';
import { SingleSpriteProps } from './SpriteDisplayProps';

export const SingleSprite = memo((props: SingleSpriteProps) => {
  if (props.name.length === 0) return null;

  if (props.name === 'substitute') {
    return (
      <Image
        className='pixel-image'
        src='https://archives.bulbagarden.net/media/upload/a/a5/SubstituteG5f.png'
        alt='Other'
        height='auto'
        width={props.big ? '80px' : '40px'}
      />
    );
  }

  return (
    <StackItem
      width={props.big ? '60px' : '35px'}
      display='flex'
      justifyContent={'center'}
    >
      <Image
        className='pixel-image'
        maxHeight={props.big ? '50px' : '35px'}
        minHeight={props.big ? '50px' : 0}
        height='auto'
        width='auto'
        src={getSpriteUrl(
          removeRegionFlag(props.name).toLowerCase(),
          getRegionFlag(props.name)
        )}
        alt={props.name}
      />
    </StackItem>
  );
});

SingleSprite.displayName = 'SingleSprite';
