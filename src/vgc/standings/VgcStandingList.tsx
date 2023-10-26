import { Table, TableBody } from "@tremor/react";
import { VgcStanding } from "./useVgcStandings";
import { VgcStandingRow } from "./VgcStandingRow";

interface VgcStandingListProps {
  standings: VgcStanding[];
  shouldShowMatchPoints: boolean;
}

export const VgcStandingList = (props: VgcStandingListProps) => {
  return (
    <Table>
      <TableBody>
        {props.standings.map((standing) => <VgcStandingRow key={`standing-${standing.id}`} standing={standing} shouldShowMatchPoints={props.shouldShowMatchPoints} />)}
      </TableBody>
    </Table>
  )
}