import { Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { useLiveTournamentResults } from '../../../hooks/tournamentResults';
import { StandingsRow } from './StandingsRow';

export const OpponentRoundList = ({
  opponents,
  tournament,
}: {
  opponents: { name: string; result: string }[];
  tournament: Tournament;
}) => {
  // We set the load - allRoundData flag to true because this component will only
  // get rendered if opponent round data is loaded. So we can just tap into that
  // without triggering a long load time for refetching the tournament.
  const { data: liveResults } = useLiveTournamentResults(tournament.id, {
    load: { allRoundData: true },
  });
  const { data: userIsAdmin } = useUserIsAdmin();

  return (
    <>
      <Tr backgroundColor={'gray.200'}>
        <Th padding={0}>Rnd</Th>
        <Th padding={0} paddingLeft={2}>
          Name
        </Th>
        <Th padding={0}>record</Th>
        <Th padding={0} paddingLeft={4}>
          Deck
        </Th>
      </Tr>
      {opponents
        .map(({ name, result }) => ({
          standing: liveResults?.data.find(standing => standing.name === name),
          name,
          result,
        }))
        .map(
          ({ standing, name, result }, idx) =>
            standing && (
              <StandingsRow
                key={idx}
                result={standing}
                tournament={tournament}
                canEditDecks={userIsAdmin}
                opponentRoundNumber={idx + 1}
                opponentResult={result}
              />
            )
        )}
    </>
  );
};
