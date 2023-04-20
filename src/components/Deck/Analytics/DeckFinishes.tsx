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
import { useFinalResults } from '../../../hooks/finalResults';
import { getFinalResultsDeckFilters } from '../../../hooks/finalResults/useCardCounts';
import { useFormats } from '../../../hooks/formats/formats';
import { getTournamentFormat } from '../../../hooks/formats/helpers';
import { useTournaments } from '../../../hooks/tournaments';
import { StandingsRow } from '../../DataDisplay/Standings/StandingsRow';
import { formatTournamentDate } from '../../TournamentList/helpers';
import { FormatContext } from './DeckAnalyticsContainer';

export const DeckFinishes = memo(
  ({ deck, onlyShowRecent }: { deck: Deck; onlyShowRecent?: boolean }) => {
    const { colorMode } = useColorMode();

    const format = useContext(FormatContext);
    const filters = getFinalResultsDeckFilters(deck, format?.id);

    const { data: deckStandings } = useFinalResults(filters);
    const { data: tournaments } = useTournaments();

    const mostRecentTournamentId = deckStandings?.find(
      standing => standing.deck?.list
    )?.tournamentId;

    return (
      <Stack spacing={1}>
        {tournaments &&
          deckStandings
            ?.filter(standing =>
              onlyShowRecent
                ? standing.tournamentId === mostRecentTournamentId &&
                  standing.deck?.list
                : true
            )
            .map((standing, idx) => {
              console.log(standing);
              const tournament = tournaments.find(
                ({ id }) => id === standing.tournamentId
              ) as Tournament;

              const shouldShowHeading =
                idx === 0 ||
                (!onlyShowRecent &&
                  deckStandings[idx - 1].tournamentId !==
                    standing.tournamentId);

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
                        color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}
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
                    isPlayerMeOrMyOpponent={false}
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
