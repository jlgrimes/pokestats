import {
  Heading,
  HStack,
  Link,
  LinkBox,
  LinkOverlay,
  Tag,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { Deck } from '../../../../types/tournament';
import { useVariants } from '../../../hooks/deckArchetypes';
import SpriteDisplay from '../../common/SpriteDisplay';

export const DeckVariants = memo(({ deck }: { deck: Deck }) => {
  const { data: variants } = useVariants(deck.supertype);

  return (
    <HStack flexWrap={'wrap'} rowGap={1}>
      <Heading size='sm' color='gray.600'>
        {deck.supertype} Variants:
      </Heading>
      {variants
        ?.filter(({ id }) => id !== deck.id)
        .map(variant => (
          <Tag key={`variant-${variant.name}`}>
            <LinkBox>
              <LinkOverlay as={NextLink} href={`/decks/${variant.id}`}>
                <HStack spacing={1}>
                  <SpriteDisplay
                    squishWidth
                    pokemonNames={
                      variant.defined_pokemon.length > 1
                        ? [variant.defined_pokemon[1]]
                        : [variant.defined_pokemon[0]]
                    }
                  />
                </HStack>
              </LinkOverlay>
            </LinkBox>
          </Tag>
        ))}
    </HStack>
  );
});

DeckVariants.displayName = 'DeckVariants';
