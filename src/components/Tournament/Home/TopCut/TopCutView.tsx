import { Card, Flex, Subtitle, Table, TableBody, Title } from '@tremor/react';
import { Standing, Tournament } from '../../../../../types/tournament';
import { PlayerCard } from '../PlayerCard/PlayerCard';
import { useTopCutStandings } from '../../../../hooks/newStandings';
import { AgeDivision } from '../../../../../types/age-division';
import { FullWidthCard } from '../../../common/new/FullWidthCard';
import { capitalize } from '../../../../lib/strings';

interface TopCutViewProps {
  tournament: Tournament;
  ageDivision: AgeDivision;
}

export const TopCutView = (props: TopCutViewProps) => {
  const { data: players } = useTopCutStandings({ tournament: props.tournament, ageDivision: props.ageDivision, shouldLoadOpponentRounds: true });

  const topCutPlayers = players && players.filter(player =>(props.tournament.tournamentStatus === 'finished' ||
  !players!.some(
    otherPlayer =>
      player.name === otherPlayer.currentOpponent?.name &&
      player.placing > otherPlayer?.placing
  )));

  const playersWhoWereKnockedOut = topCutPlayers?.filter((player) => !player.currentOpponent);

  return (
    <>
      {props.tournament.tournamentStatus === 'finished' && (
        <FullWidthCard title={`${capitalize(props.ageDivision)} top cut`}>
          <Table className='overflow-hidden'>
            <TableBody>
              {topCutPlayers?.map((player) => (
                <PlayerCard
                  key={`top-cut-card-${player.name}`}
                  player={player}
                  tournament={props.tournament}
                />
              ))}
            </TableBody>
          </Table>
        </FullWidthCard>
      )}
      {props.tournament.tournamentStatus === 'running' &&  topCutPlayers?.filter((player) => player.currentOpponent).map(
            (player: Standing) =>
                <Card key={`top-cut-${player.name}`} className='p-0 mb-4'>
                  <Table>
                    <TableBody>
                      <PlayerCard
                        player={player}
                        tournament={props.tournament}
                        result={
                          props.tournament.tournamentStatus === 'running'
                            ? player.currentMatchResult
                            : undefined
                        }
                      />
                    {
                      player.currentOpponent && (
                        <PlayerCard
                          player={player.currentOpponent as Standing}
                          tournament={props.tournament}
                          result={
                            props.tournament.tournamentStatus === 'running'
                              ? (player.currentOpponent as Standing)?.currentMatchResult
                              : undefined
                          }
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
                    result={
                      props.tournament.tournamentStatus === 'running'
                        ? player.currentMatchResult
                        : undefined
                    }
                  />
                ))}
              </TableBody>
            </Table>
          )}
    </>
  );
};
