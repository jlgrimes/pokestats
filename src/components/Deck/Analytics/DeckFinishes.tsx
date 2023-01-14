import { Grid, Stack } from '@chakra-ui/react';
import { memo } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { useFinalResults } from '../../../hooks/finalResults';
import { useTournaments } from '../../../hooks/tournaments';
import { StandingsRow } from '../../DataDisplay/Standings/StandingsRow';

export const DeckFinishes = memo(({ deck }: { deck: Deck }) => {
  const { data: deckStandings } = useFinalResults({ deckId: deck.id });
  const { data: tournaments } = useTournaments();

  return (
    <Grid
      gridTemplateColumns='2.3rem repeat(3, auto)'
      alignItems='center'
    >
      {tournaments &&
        deckStandings?.map(standing => (
          <StandingsRow
            key={standing.name}
            result={{
              ...standing,
              deck: {
                ...deck,
                list: standing.deck_list
              }
            }}
            tournament={
              tournaments.find(
                ({ id }) => id === standing.tournamentId
              ) as Tournament
            }
          />
        ))}
    </Grid>
  );
});

DeckFinishes.displayName = 'DeckFinishes';
