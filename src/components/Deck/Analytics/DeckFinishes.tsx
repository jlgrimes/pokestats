import { Button, Grid, GridItem, Heading, Link, Stack } from '@chakra-ui/react';
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
    const router = useRouter();

    const mostRecentTournamentId = deckStandings?.[0]?.tournamentId;

    return (
      <Grid gridTemplateColumns='2.1rem repeat(3, auto)' alignItems='center'>
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
                  {shouldShowHeading && onlyShowRecent && (
                    <Heading size='md' color='gray.700' gridColumn={'1/-1'}>
                      Recent finishes
                    </Heading>
                  )}
                  {shouldShowHeading && (
                    <Link
                      gridColumn={'1/-1'}
                      as={NextLink}
                      href={`/tournaments/${standing.tournamentId}/standings`}
                    >
                      <Heading
                        size='sm'
                        color='gray.700'
                        paddingTop={3}
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
                </Fragment>
              );
            })}
        {onlyShowRecent && (
          <GridItem gridColumn={'1/-1'}>
            <Button
              size='sm'
              variant='outline'
              onClick={() => router.push(router.asPath + '/finishes')}
              rightIcon={<FaArrowRight />}
            >
              See more
            </Button>
          </GridItem>
        )}
      </Grid>
    );
  }
);

DeckFinishes.displayName = 'DeckFinishes';
