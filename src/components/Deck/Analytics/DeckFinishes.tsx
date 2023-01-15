import { Grid, Heading, Stack } from '@chakra-ui/react';
import { Fragment, memo } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { useFinalResults } from '../../../hooks/finalResults';
import { useTournaments } from '../../../hooks/tournaments';
import { shortenTournamentName } from '../../../lib/tournament';
import { StandingsRow } from '../../DataDisplay/Standings/StandingsRow';

export const DeckFinishes = memo(({ deck }: { deck: Deck }) => {
  const { data: deckStandings } = useFinalResults({ deckId: deck.id });
  const { data: tournaments } = useTournaments();

  return (
    <Grid gridTemplateColumns='2rem repeat(3, auto)' alignItems='center'>
      {tournaments &&
        deckStandings?.map((standing, idx) => {
          const tournament = tournaments.find(
            ({ id }) => id === standing.tournamentId
          ) as Tournament;

          const shouldShowHeading =
            idx === 0 ||
            deckStandings[idx - 1].tournamentId !== standing.tournamentId;

          return (
            <Fragment key={standing.name + standing.tournamentId}>
              {shouldShowHeading && (
                <Heading
                  gridColumn={'1/-1'}
                  size='sm'
                  color='gray.700'
                  paddingTop={4}
                  paddingBottom={1}
                >
                  {shortenTournamentName(tournament)}
                </Heading>
              )}
              <StandingsRow
                result={{
                  ...standing,
                  deck: {
                    ...deck,
                    list: standing.deck_list,
                  },
                }}
                tournament={tournament}
              />
            </Fragment>
          );
        })}
    </Grid>
  );
});

DeckFinishes.displayName = 'DeckFinishes';
