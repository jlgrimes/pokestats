import { Stack } from '@chakra-ui/react';
import { CombinedPlayerProfile } from '../../../../types/player';
import { Tournament } from '../../../../types/tournament';
import { useLiveTournamentResults } from '../../../hooks/tournamentResults';
import { ComponentLoader } from '../../common/ComponentLoader';
import { MyTournamentView } from '../../Tournament/Home/MyTournamentView';
import { TournamentInfo } from '../../TournamentList/TournamentInfo';

interface LiveResultsWrapperProps {
  tournament: Tournament;
  user: CombinedPlayerProfile;
  isLoggedInUser: boolean;
}

export const LiveResultsWrapper = (props: LiveResultsWrapperProps) => {
  const { isLoading, data } = useLiveTournamentResults(props.tournament.id, {
    load: { allRoundData: true },
  });

  const playerInLiveTournament = data?.data.find(
    standing =>
      standing.name === props.user.name ||
      props.user.additional_names?.includes(standing.name)
  );

  if (isLoading) return <ComponentLoader />;
  if (!playerInLiveTournament) return null;

  return (
    <Stack>
      <TournamentInfo tournament={props.tournament} />
      <MyTournamentView tournament={props.tournament} />
    </Stack>
  );
};
