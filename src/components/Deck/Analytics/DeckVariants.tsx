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
import { memo, useContext } from 'react';
import { Deck } from '../../../../types/tournament';
import { useVariants } from '../../../hooks/deckArchetypes';
import SpriteDisplay from '../../common/SpriteDisplay/SpriteDisplay';
import { FormatContext } from './DeckAnalyticsContainer';

export const DeckVariants = memo(({ deck }: { deck: Deck }) => {
  const format = useContext(FormatContext);
  const { data: variants } = useVariants(deck.supertype?.id, format);
  const variantsExcludingSelf = variants?.filter(({ id }) => id !== deck.id);

  if (!(variantsExcludingSelf && variantsExcludingSelf.length > 0)) return null;

  return (
    <HStack flexWrap={'wrap'} rowGap={1}>
      <Heading size='sm' color='gray.600' fontWeight='medium'>
        Variants:
      </Heading>
      {variantsExcludingSelf.map(variant => (
        <LinkBox key={`variant-${variant.name}`}>
          <LinkOverlay
            as={NextLink}
            href={`/decks/${deck.supertype?.id}/${variant.id}`}
          >
            <Tag>
              <HStack spacing={1}>
                <SpriteDisplay
                  squishWidth
                  pokemonNames={
                    variant.defined_pokemon.length > 1 &&
                    variant.defined_pokemon[1].length > 1
                      ? [variant.defined_pokemon[1]]
                      : [variant.defined_pokemon[0]]
                  }
                />
              </HStack>
            </Tag>
          </LinkOverlay>
        </LinkBox>
      ))}
    </HStack>
  );
});

DeckVariants.displayName = 'DeckVariants';
