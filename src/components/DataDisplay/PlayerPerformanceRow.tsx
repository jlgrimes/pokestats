import { useDisclosure } from "@chakra-ui/react";
import { Bold, TableRow } from "@tremor/react"
import { CombinedPlayerProfile } from "../../../types/player";
import { Standing, Tournament } from "../../../types/tournament"
import { useUserMatchesLoggedInUser } from "../../hooks/user";
import { ordinalSuffixOf } from "../../lib/strings";
import { DeckInfoDisplay } from "../Deck/DeckInfoDisplay";
import { Record } from "../Tournament/Results/ResultsList/Record";
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
    <TableRow className='h-14' onClick={onOpen}>
      <StandingsCell className='pr-4'>
        <p>{props.tournament.name}</p>
        <p></p>
      </StandingsCell>
      <StandingsCell width={80} className='pr-4'>
        <DeckInfoDisplay
          tournament={props.tournament}
          player={props.performance}
          enableEdits={userMatchesLoggedInUser}
          disableList
          isMe={userMatchesLoggedInUser}
        />
      </StandingsCell>
      <StandingsCell className='text-right pr-2'>
        <Bold>
          {ordinalSuffixOf(props.performance.placing)}
        </Bold>
      </StandingsCell>
      <StandingsCell className='text-right'>
        <Record standing={props.performance} />
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