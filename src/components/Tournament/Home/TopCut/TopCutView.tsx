import { Badge, Icon, Stack } from '@chakra-ui/react';
import { Card, Flex, Subtitle, Table, TableBody, Title } from '@tremor/react';
import { useMemo } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { CommonCard } from '../../../common/CommonCard';
import { getRoundText } from '../../helpers';
import { PlayerCard } from '../PlayerCard/PlayerCard';

interface TopCutViewProps {
  tournament: Tournament;
  players?: Standing[];
  isLoading?: boolean;
}

export const TopCutView = (props: TopCutViewProps) => {
  const topCutPlayers = props.players && props.players.filter(player =>(props.tournament.tournamentStatus === 'finished' ||
  !props.players!.some(
    otherPlayer =>
      player.name === otherPlayer.currentOpponent?.name &&
      player.placing > otherPlayer?.placing
  )));

  const playersWhoWereKnockedOut = topCutPlayers?.filter((player) => !player.currentOpponent);

  return (
    <Flex className='flex-col gap-4'>
      <Title>Top cut</Title>
        {topCutPlayers?.filter((player) => player.currentOpponent).map(
            (player: Standing) =>
                <Card key={`top-cut-${player.name}`} className='p-0 mb-4'>
                  <Table>
                    <TableBody>
                      <PlayerCard
                        player={player}
                        tournament={props.tournament}
                        shouldHideDecks={false}
                        result={
                          props.tournament.tournamentStatus === 'running'
                            ? player.currentMatchResult
                            : undefined
                        }
                        isPlayerMeOrMyOpponent={false}
                      />
                    {
                      player.currentOpponent && (
                        <PlayerCard
                          player={player.currentOpponent}
                          tournament={props.tournament}
                          shouldHideDecks={false}
                          result={
                            props.tournament.tournamentStatus === 'running'
                              ? player.currentOpponent?.currentMatchResult
                              : undefined
                          }
                          isPlayerMeOrMyOpponent={false}
                        />
                      )
                    }
                    </TableBody>
                  </Table>
              </Card>
          )}
          {playersWhoWereKnockedOut && playersWhoWereKnockedOut.length > 0 && (
            <Table className='opacity-40'>
              <TableBody>
                {playersWhoWereKnockedOut.map((player) => (
                  <PlayerCard
                    key={`${player.name}`}
                    player={player}
                    tournament={props.tournament}
                    shouldHideDecks={false}
                    result={
                      props.tournament.tournamentStatus === 'running'
                        ? player.currentMatchResult
                        : undefined
                    }
                    isPlayerMeOrMyOpponent={false}
                  />
                ))}
              </TableBody>
            </Table>
          )}
    </Flex>
  );
};
