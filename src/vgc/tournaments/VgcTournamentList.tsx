import { VgcTournamentLink } from "./VgcTournamentLink"
import { VgcTournament } from "./useVgcTournaments"

interface VgcTournamentListProps {
  tournaments: VgcTournament[]
}

export const VgcTournamentList = (props: VgcTournamentListProps) => {
  return (
    <>
      {props.tournaments.map((tournament) => <VgcTournamentLink key={`tournament-card-${tournament.id}`} tournament={tournament} />)}
    </>
  )
}