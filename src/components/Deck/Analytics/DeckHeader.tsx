import { memo, useMemo } from 'react';
import { Heading, HStack, Image, Stack } from '@chakra-ui/react';
import { getCardImageUrl } from '../ListViewer/helpers';
import { Card, Deck } from '../../../../types/tournament';
import { useCodeToSetMap } from '../../../hooks/deckList';
import { useFinalResults } from '../../../hooks/finalResults';

export const DeckHeader = memo(({ deck }: { deck: Deck }) => {
  const { data: deckStandings } = useFinalResults({ deckId: deck.id });
  const codeToSetMap = useCodeToSetMap();

  const identifiableCards = useMemo(
    () =>
      deck.identifiable_cards
        ?.map(cardName => {
          return deckStandings?.[0]?.deck_list?.pokemon.find(({ name, set }) => {
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
          });
        })
        .filter(card => card),
    [deck.identifiable_cards, deckStandings]
  );

  const heightWidthRatio = 1.396;
  const width = 125;
  const height = width * heightWidthRatio;

  return (
    <Stack spacing={4}>
      <HStack spacing={0}>
        {identifiableCards?.map(card => (
          <Image
            key={`${card?.name} ${card?.set}`}
            width={`${width}px`}
            height={`${height}px`}
            src={getCardImageUrl(card as Card, codeToSetMap, { highRes: true })}
            alt={`${card?.name} ${card?.set}`}
          />
        ))}
      </HStack>
      <Heading color='gray.700'>{deck.name}</Heading>
    </Stack>
  );
});

DeckHeader.displayName = 'DeckHeader';
