import {
  Button,
  Heading,
  Image,
  ModalBody,
  Stack,
  Text,
} from '@chakra-ui/react';
import { memo, useCallback } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { Card, Deck, Tournament } from '../../../../../types/tournament';
import { useDay2Decks } from '../../../../hooks/day2decks';
import { useCodeToSetMap } from '../../../../hooks/deckList';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { shortenTournamentName } from '../../../../lib/tournament';
import { getCardImageUrl } from '../helpers';
import { fixPercentage, getCardCount, listContainsCard } from './helpers';

export const CardViewerBody = memo(
  ({
    card,
    clearSelectedCard,
    tournament,
    deck,
  }: {
    card: Card;
    clearSelectedCard: () => void;
    tournament: Tournament;
    deck: Deck;
  }) => {
    const codeToSetMap = useCodeToSetMap();
    const { data: day2decks } = useDay2Decks(tournament.id, {
      includeStanding: true,
    });

    const decksOfSameArchetype =
      day2decks?.filter(({ id }) => id === deck.id) ?? [];
    const decksThatIncludeCard = decksOfSameArchetype?.filter(
      ({ list }) => list && listContainsCard(list, card)
    );
    const percentageOfDecksThatDidNotPlayCard =
      (1 - decksThatIncludeCard?.length / decksOfSameArchetype?.length) * 100;

    const cardCounts = decksThatIncludeCard.reduce(
      (acc: Record<number, number>, deck) => {
        if (deck.list) {
          const cardCount = getCardCount(deck.list, card);

          if (acc[cardCount]) {
            return {
              ...acc,
              [cardCount]: acc[cardCount] + 1,
            };
          }

          return {
            ...acc,
            [cardCount]: 1,
          };
        }

        return acc;
      },
      {}
    );

    const cardCountsSorted = Object.entries(cardCounts).sort((a, b) => {
      if (a[0] > b[0]) return -1;
      if (b[0] < a[0]) return 1;
      return 0;
    });

    const getCopyText = useCallback(
      (count: number) => (count === 1 ? 'copy' : 'copies'),
      []
    );

    const heightWidthRatio = 1.396;
    const width = 200;
    const height = width * heightWidthRatio;

    return (
      <ModalBody>
        <Stack>
          <div>
            <Button
              variant='ghost'
              leftIcon={<FaChevronLeft />}
              onClick={clearSelectedCard}
            >
              Back
            </Button>
          </div>
          <Image
            width={`${width}px`}
            height={`${height}px`}
            src={getCardImageUrl(card, codeToSetMap, { highRes: true })}
            alt={`${card.name} ${card.set}`}
          />
          <Stack spacing={0}>
            <Heading size='lg'>{card.name}</Heading>
            <Heading size='sm' color='gray.500'>
              {deck.name}, {shortenTournamentName(tournament.name)}
            </Heading>
          </Stack>
          {cardCountsSorted.map(([count, numberOfCount], idx) =>
            numberOfCount === 1 ? (
              <Text key={idx}>
                <b>1 deck</b> played {count} {getCopyText(parseInt(count))}
              </Text>
            ) : (
              <Text key={idx}>
                <b>{numberOfCount} decks</b>{' '}
                {percentageOfDecksThatDidNotPlayCard > 0 ? 'of those ' : ''}(
                {fixPercentage(
                  (numberOfCount / decksThatIncludeCard.length) * 100
                )}
                %) played {count} {getCopyText(parseInt(count))}
              </Text>
            )
          )}
          {percentageOfDecksThatDidNotPlayCard > 0 && (
            <Text>
              <b>
                {decksOfSameArchetype.length - decksThatIncludeCard.length}{' '}
                decks
              </b>{' '}
              ({fixPercentage(percentageOfDecksThatDidNotPlayCard)}%) played 0
              copies
            </Text>
          )}
        </Stack>
      </ModalBody>
    );
  }
);

CardViewerBody.displayName = 'CardViewer';
