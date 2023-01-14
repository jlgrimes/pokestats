import {
  Button,
  Heading,
  Image,
  ModalBody,
  Stack,
  Text,
} from '@chakra-ui/react';
import { memo } from 'react';
import { Card, Deck, Tournament } from '../../../../../types/tournament';
import { useDay2Decks } from '../../../../hooks/day2decks';
import { useCodeToSetMap } from '../../../../hooks/deckList';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { shortenTournamentName } from '../../../../lib/tournament';
import { getCardImageUrl } from '../helpers';
import { getCardCount, listContainsCard } from './helpers';

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
    const { data: day2decks } = useDay2Decks(tournament.id);

    const decksOfSameArchetype =
      day2decks?.filter(({ id }) => id === deck.id) ?? [];
    const decksThatIncludeCard = decksOfSameArchetype?.filter(
      ({ list }) => list && listContainsCard(list, card)
    );
    const percentageOfDecksThatPlayedCard =
      (decksThatIncludeCard?.length / decksOfSameArchetype?.length) * 100;

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

    const heightWidthRatio = 1.396;
    const width = 200;
    const height = width * heightWidthRatio;

    return (
      <ModalBody>
        <Stack>
          <Button onClick={clearSelectedCard}>go back</Button>
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
          <Text>
            {decksThatIncludeCard.length} (
            {percentageOfDecksThatPlayedCard.toFixed(2)}%) decks played at least
            one {card.name}
          </Text>
          {Object.entries(cardCounts).map(([count, numberOfCount], idx) => (
            <Text key={idx}>
              {numberOfCount} (
              {((numberOfCount / decksThatIncludeCard.length) * 100).toFixed(2)}
              %) decks played {count} copies of {card.name}
            </Text>
          ))}
        </Stack>
      </ModalBody>
    );
  }
);

CardViewerBody.displayName = 'CardViewer';
