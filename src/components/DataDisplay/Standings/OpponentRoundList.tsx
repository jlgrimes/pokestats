import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Stack,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { useLiveTournamentResults } from '../../../hooks/tournamentResults';
import { StandingsRow } from './StandingsRow';

export const OpponentRoundList = ({
  opponents,
  tournament,
  playerName,
}: {
  opponents: { name: string; result: string }[];
  tournament: Tournament;
  playerName: string;
}) => {
  // We set the load - allRoundData flag to true because this component will only
  // get rendered if opponent round data is loaded. So we can just tap into that
  // without triggering a long load time for refetching the tournament.
  const { data: liveResults } = useLiveTournamentResults(tournament.id, {
    load: { allRoundData: true },
  });
  const { data: userIsAdmin } = useUserIsAdmin();

  return (
    <Card gridColumn={'1/-1'}>
      <CardBody padding='4' paddingTop='0'>
        <Grid gridTemplateColumns={'2rem repeat(3, auto)'} alignItems='center'>
          <GridItem gridColumn={'1/-1'} padding={1}>
            <Text
              as='b'
              fontSize={'small'}
              color='gray.700'
            >{`${playerName}'s match history`}</Text>
          </GridItem>
          {opponents
            .slice(0)
            .reverse()
            .map(({ name, result }) => ({
              standing: liveResults?.data.find(
                standing => standing.name === name
              ),
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
        </Grid>
      </CardBody>
    </Card>
  );
};
