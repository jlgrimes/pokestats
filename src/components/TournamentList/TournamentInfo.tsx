import { Subtitle, Title } from '@tremor/react';
import { Tournament } from '../../../types/tournament';
import { formatTournamentDate } from './helpers';

interface TournamentInfoProps {
  tournament: Tournament;
}

export const TournamentInfo = (props: TournamentInfoProps) => {
  const live = props.tournament.tournamentStatus === 'running';

  return (
    <>
      <Title>
        {props.tournament.name}
      </Title>
      {!live && (
        <Subtitle>
          {formatTournamentDate(props.tournament)}
        </Subtitle>
      )}
    </>
  );
};
