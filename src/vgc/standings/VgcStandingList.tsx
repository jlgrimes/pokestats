import { Table, TableBody } from "@tremor/react";
import { VgcStanding } from "./useVgcStandings";
import { VgcStandingRow } from "./VgcStandingRow";

interface VgcStandingListProps {
  standings: VgcStanding[];
}

export const VgcStandingList = (props: VgcStandingListProps) => {
  return (
    <Table>
      <TableBody>
        {props.standings.map((standing) => <VgcStandingRow key={`standing-${standing.id}`} standing={standing} />)}
      </TableBody>
    </Table>
  )
}