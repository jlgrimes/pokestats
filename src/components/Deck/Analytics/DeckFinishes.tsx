import { Button, Divider, Grid, GridItem, Heading, Link, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, memo } from 'react';
import {
  FaArrowRight,
  FaChevronRight,
  FaExpand,
  FaExpandAlt,
} from 'react-icons/fa';
import { Deck, Tournament } from '../../../../types/tournament';
import { useFinalResults } from '../../../hooks/finalResults';
import { useTournaments } from '../../../hooks/tournaments';
import { shortenTournamentName } from '../../../lib/tournament';
import { StandingsRow } from '../../DataDisplay/Standings/StandingsRow';

export const DeckFinishes = memo(
  ({ deck, onlyShowRecent }: { deck: Deck; onlyShowRecent?: boolean }) => {
    const { data: deckStandings } = useFinalResults({ deckId: deck.id });
    const { data: tournaments } = useTournaments();

    const mostRecentTournamentId = deckStandings?.[0]?.tournamentId;

    return (
      <Grid gridTemplateColumns='2.1rem repeat(2, auto) 2.1rem' alignItems='center'>
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
                        paddingTop={onlyShowRecent ? 0 : 3}
                        paddingBottom={1}
                      >
                        {shortenTournamentName(tournament)}
                      </Heading>
                    </Link>
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
                    hideArchetype
                  />
                  <Divider gridColumn={'1/-1'} />
                </Fragment>
              );
            })}
      </Grid>
    );
  }
);

DeckFinishes.displayName = 'DeckFinishes';
