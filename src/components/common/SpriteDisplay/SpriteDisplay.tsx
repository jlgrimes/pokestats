import { LinkBox, LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import { SpriteDisplayProps } from './SpriteDisplayProps';
import { Sprites } from './Sprites';

export default function SpriteDisplay(props: SpriteDisplayProps) {
  const deckIsReal =
    props.pokemonNames &&
    props.pokemonNames[0] &&
    props.pokemonNames[0].length > 0 &&
    props.pokemonNames[0] !== 'substitute';

  if (props.hidden || !deckIsReal) {
    return <Sprites {...props} shouldHideVerification />;
  }

  return (
    <LinkBox>
      <LinkOverlay as={NextLink} href={`/decks/${props.deckId}`}>
        <Sprites {...props} />
      </LinkOverlay>
    </LinkBox>
  );
}
