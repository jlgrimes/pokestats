import { Button, Heading, Image, ModalBody, Stack } from '@chakra-ui/react';
import { memo } from 'react';
import { Card, Deck, Tournament } from '../../../../../types/tournament';
import { useDay2Decks } from '../../../../hooks/day2decks';
import { useCodeToSetMap } from '../../../../hooks/deckList';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { getCardImageUrl } from '../helpers';
import { listContainsCard } from './helpers';

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
    
    const decksOfSameArchetype = day2decks?.filter(({ id }) => id === deck.id);
    const decksThatIncludeCard = decksOfSameArchetype?.filter(({ de }) => listContainsCard(list, card))

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
          <Heading size='lg'>{card.name}</Heading>
        </Stack>
      </ModalBody>
    );
  }
);

CardViewerBody.displayName = 'CardViewer';
