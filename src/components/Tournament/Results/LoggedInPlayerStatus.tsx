import { useLiveTournamentResults } from "../../../hooks/tournamentResults";
import { useTwitterUsername } from "../../../hooks/twitter";

export const LoggedInPlayerStatus = ({
  tournament,
}: {
  tournament: { id: string; name: string };
}) => {
  const { data: liveResults } = useLiveTournamentResults(tournament.id);
  const { data: username } = useTwitterUsername();

  console.log(liveResults?.data.find((result) => result.profile?.twitterHandle === username))

  return <></>
};
