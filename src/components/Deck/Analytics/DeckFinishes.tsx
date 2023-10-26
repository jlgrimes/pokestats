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
import { getMostRecentFinishedTournament, useTournaments } from '../../../hooks/tournaments';
import { StandingsRow } from '../../DataDisplay/Standings/StandingsRow';
import { formatTournamentDate } from '../../TournamentList/helpers';
import { FormatContext } from './DeckAnalyticsContainer';
import { useDeckStandings } from '../../../hooks/newStandings';
import { TournamentCard } from '../../TournamentList/TournamentCard';
import { Table, TableBody, TableRow } from '@tremor/react';

export const DeckFinishes = memo(
  ({ deck, onlyShowRecent }: { deck: Deck; onlyShowRecent?: boolean }) => {
    const { data: tournaments } = useTournaments();
    const mostRecentFinished = tournaments ? getMostRecentFinishedTournament(tournaments) : null;

    const { data: deckStandings } = useDeckStandings(deck, parseInt(mostRecentFinished?.id ?? ''), true);

    if (!tournaments || !deckStandings || !mostRecentFinished) return null;

    if (onlyShowRecent) {
      return <>
        <TournamentCard tournament={mostRecentFinished} />
        <Table>
          <TableBody>
            {deckStandings.filter(standing => standing.tournament_id === parseInt(mostRecentFinished.id)).map((standing) => (
              <TableRow key={'finish ' + standing.name}>
                <StandingsRow
                    result={standing}
                    tournament={mostRecentFinished}
                  />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    }

    return (
      <>
        {deckStandings?.slice(0, onlyShowRecent ? 10 : -1)
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
                    <TournamentCard tournament={tournament} />
                  )}
                  <StandingsRow
                    result={standing}
                    tournament={tournament}
                  />
                </Fragment>
              );
            })}
      </>
    );
  }
);

DeckFinishes.displayName = 'DeckFinishes';
