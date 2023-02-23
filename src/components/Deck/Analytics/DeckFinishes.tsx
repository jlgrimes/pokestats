import { Divider, Grid, Heading, Link, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Fragment, memo } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { useFinalResults } from '../../../hooks/finalResults';
import { useTournaments } from '../../../hooks/tournaments';
import { StandingsRow } from '../../DataDisplay/Standings/StandingsRow';
import { formatTournamentDate } from '../../TournamentList/helpers';

export const DeckFinishes = memo(
  ({ deck, onlyShowRecent }: { deck: Deck; onlyShowRecent?: boolean }) => {
    const filters =
      deck.classification === 'supertype'
        ? { supertypeId: deck.id }
        : { deckId: deck.id };

    const { data: deckStandings } = useFinalResults(filters);
    const { data: tournaments } = useTournaments();

    const mostRecentTournamentId = deckStandings?.[0]?.tournamentId;

    return (
      <Stack spacing={1}>
        {tournaments &&
          deckStandings
            ?.filter(standing =>
              onlyShowRecent
                ? standing.tournamentId === mostRecentTournamentId
                : true
            )
            .slice(0, onlyShowRecent ? 5 : undefined)
            .map((standing, idx) => {
              const tournament = tournaments.find(
                ({ id }) => id === standing.tournamentId
              ) as Tournament;

              const shouldShowHeading =
                idx === 0 ||
                deckStandings[idx - 1].tournamentId !== standing.tournamentId;

              return (
                <Fragment key={standing.name + standing.tournamentId}>
                  {shouldShowHeading && (
                    <Link
                      gridColumn={'1/-1'}
                      as={NextLink}
                      href={`/tournaments/${standing.tournamentId}/standings`}
                    >
                      <Heading
                        size='sm'
                        color='gray.700'
                        paddingX={2}
                        paddingTop={onlyShowRecent ? 0 : 3}
                      >
                        {tournament.name}
                      </Heading>
                      <Heading
                        size='xs'
                        color='gray.500'
                        paddingX={2}
                        paddingY={1}
                      >
                        {formatTournamentDate(tournament)}
                      </Heading>
                    </Link>
                  )}
                  <StandingsRow
                    result={{
                      ...standing,
                      deck: {
                        ...standing.deck,
                        defined_pokemon:
                          standing.deck?.defined_pokemon ??
                          deck.defined_pokemon,
                      } as Deck,
                    }}
                    tournament={tournament}
                  />
                  <Divider gridColumn={'1/-1'} />
                </Fragment>
              );
            })}
      </Stack>
    );
  }
);

DeckFinishes.displayName = 'DeckFinishes';
