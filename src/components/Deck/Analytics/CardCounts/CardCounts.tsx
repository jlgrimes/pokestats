import { Card, Grid, HStack, Image, Stat, StatNumber } from '@chakra-ui/react';
import { Deck } from '../../../../../types/tournament';
import { useCardCounts } from '../../../../hooks/finalResults';
import { SingleCardCountDisplay } from './SingleCardCountDisplay';

export const CardCounts = ({ deck }: { deck: Deck }) => {
  const cardCounts = useCardCounts(deck);
  // This is assuming each archetype unanimously runs a card.
  // If this isn't the case, you need to redefine what the archetype is.
  const numberOfDecks = cardCounts[0]?.count;

  return (
    <Grid gridTemplateColumns={'repeat(3, 1fr)'}>
      {cardCounts.map(({ card, count }) => {
        return (
          <SingleCardCountDisplay
            key={`${card.name}-${card.set}`}
            card={card}
            count={count}
            numberOfDecks={numberOfDecks}
          />
        );
      })}
    </Grid>
  );
};
