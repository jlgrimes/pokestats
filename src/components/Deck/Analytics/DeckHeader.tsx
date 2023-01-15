import { memo, useMemo } from 'react';
import {
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { getCardImageUrl } from '../ListViewer/helpers';
import { Card, Deck } from '../../../../types/tournament';
import { useCodeToSetMap } from '../../../hooks/deckList';
import { useFinalResults } from '../../../hooks/finalResults';
import SpriteDisplay from '../../common/SpriteDisplay';

export const DeckHeader = memo(
  ({ deck, compact }: { deck: Deck; compact?: boolean }) => {
    const { data: deckStandings } = useFinalResults({ deckId: deck.id });
    const codeToSetMap = useCodeToSetMap();

    const identifiableCards = useMemo(
      () =>
        deck.identifiable_cards
          ?.map(cardName => {
            return deckStandings?.[0]?.deck_list?.pokemon.find(
              ({ name, set }) => {
                // Hard code to get the right Inteleon
                if (
                  name === 'Inteleon' &&
                  deckStandings?.[0].deck_list?.pokemon.find(
                    ({ name, set }) => name === 'Inteleon' && set === 'SSH'
                  ) &&
                  set !== 'SSH'
                ) {
                  return false;
                }
                return name === cardName;
              }
            );
          })
          .filter(card => card),
      [deck.identifiable_cards, deckStandings]
    );

    const heightWidthRatio = 1.396;
    const width = 100;
    const height = width * heightWidthRatio;

    if (compact) {
      return (
        <LinkBox>
          <LinkOverlay as={NextLink} href={`/decks/${deck.id}`}>
            <HStack>
              <Heading color='gray.700' size='md'>
                {deck.name}
              </Heading>
              <SpriteDisplay pokemonNames={deck.defined_pokemon} />
            </HStack>
          </LinkOverlay>
        </LinkBox>
      );
    }

    return (
      <Stack>
        <HStack spacing={0}>
          {identifiableCards?.map(card => (
            <Image
              key={`${card?.name} ${card?.set}`}
              width={`${width}px`}
              height={`${height}px`}
              src={getCardImageUrl(card as Card, codeToSetMap, {
                highRes: true,
              })}
              alt={`${card?.name} ${card?.set}`}
            />
          ))}
        </HStack>
        <Heading color='gray.700'>{deck.name}</Heading>
      </Stack>
    );
  }
);

DeckHeader.displayName = 'DeckHeader';
