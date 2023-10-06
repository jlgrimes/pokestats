import {
  Divider,
  Grid,
  Heading,
  Link,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Fragment, memo, useContext } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { getFinalResultsDeckFilters } from '../../../hooks/finalResults/useCardCounts';
import { useTournaments } from '../../../hooks/tournaments';
import { StandingsRow } from '../../DataDisplay/Standings/StandingsRow';
import { formatTournamentDate } from '../../TournamentList/helpers';
import { FormatContext } from './DeckAnalyticsContainer';
import { useDeckStandings } from '../../../hooks/newStandings';

export const DeckFinishes = memo(
  ({ deck, onlyShowRecent }: { deck: Deck; onlyShowRecent?: boolean }) => {
    const { colorMode } = useColorMode();

    const format = useContext(FormatContext);

    const { data: deckStandings } = useDeckStandings(deck);
    const { data: tournaments } = useTournaments();

    const mostRecentTournamentId = deckStandings?.find(
      standing => standing.decklist
    )?.tournament_id;

    return (
      <Stack spacing={1}>
        {tournaments &&
          deckStandings
            ?.filter(standing =>
              onlyShowRecent
                ? standing.tournament_id === mostRecentTournamentId &&
                  standing.decklist
                : true
            )
            .slice(0, onlyShowRecent ? 10 : -1)
            .map((standing, idx) => {
              const tournament = tournaments.find(
                ({ id }) => parseInt(id) === standing.tournament_id
              ) as Tournament;

              const shouldShowHeading =
                idx === 0 ||
                (!onlyShowRecent &&
                  deckStandings[idx - 1].tournament !==
                    standing.tournament_id);

              return (
                <Fragment key={standing.name + standing.tournament_id}>
                  {shouldShowHeading && (
                    <Link
                      gridColumn={'1/-1'}
                      as={NextLink}
                      href={`/tournaments/${standing.tournament_id}/masters/standings`}
                    >
                      <Heading
                        size='sm'
                        color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}
                        paddingX={4}
                        paddingTop={onlyShowRecent ? 0 : 3}
                      >
                        {tournament.name}
                      </Heading>
                      <Heading
                        size='xs'
                        color='gray.500'
                        paddingX={4}
                        paddingY={1}
                      >
                        {formatTournamentDate(tournament)}
                      </Heading>
                    </Link>
                  )}
                  <StandingsRow
                    result={standing}
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
