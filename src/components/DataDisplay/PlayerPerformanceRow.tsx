import { useDisclosure } from "@chakra-ui/react";
import { Bold, Subtitle, TableRow, Text, Title } from "@tremor/react"
import { CombinedPlayerProfile } from "../../../types/player";
import { Standing, Tournament } from "../../../types/tournament"
import { useUserMatchesLoggedInUser } from "../../hooks/user";
import { ordinalSuffixOf } from "../../lib/strings";
import { DeckInfoDisplay } from "../Deck/DeckInfoDisplay";
import { formatRecord } from "../Tournament/Results/ResultsList/helpers";
import { Record } from "../Tournament/Results/ResultsList/Record";
import { formatTournamentDate } from "../TournamentList/helpers";
import { OpponentRoundList } from "./Standings/OpponentRoundList/OpponentRoundList";
import { StandingsCell } from "./Standings/StandingsRow"

interface PlayerPerformanceRowProps {
  tournament: Tournament;
  performance: Standing;
  user: CombinedPlayerProfile | null | undefined;
}

export const PlayerPerformanceRow = (props: PlayerPerformanceRowProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userMatchesLoggedInUser = useUserMatchesLoggedInUser(props.user?.name);

  return (
    <TableRow className='h-20' onClick={onOpen}>
      <StandingsCell className='pr-4'>
        <Text className={props.performance.day_two ? 'font-bold' : ''}>{props.tournament.name}</Text>
        <Subtitle>{formatTournamentDate(props.tournament)}</Subtitle>
      </StandingsCell>
      <StandingsCell width={60} className='pr-2'>
        <DeckInfoDisplay
          tournament={props.tournament}
          player={props.performance}
          enableEdits={userMatchesLoggedInUser && props.tournament.tournamentStatus === 'finished'}
          disableList
          isMe={userMatchesLoggedInUser}
        />
      </StandingsCell>
      <StandingsCell className='text-right'>
        <Text className={props.performance.day_two ? 'font-bold' : ''}>
          {ordinalSuffixOf(props.performance.placing)}
        </Text>
        <Text className={`whitespace-nowrap ${props.performance.day_two ? 'font-bold' : 'font-normal'}`}>{formatRecord(props.performance.record)}</Text>
      </StandingsCell>
      <OpponentRoundList
        player={props.performance}
        tournament={props.tournament}
        modalOpen={isOpen}
        handleCloseModal={onClose}
      />
    </TableRow>
  )
}
