import { Bold, TableCell, TableRow } from "@tremor/react";
import { VgcStanding } from "./useVgcStandings";
import { formatRecord } from "../../components/Tournament/Results/ResultsList/helpers";

interface VgcStandingProps {
  standing: VgcStanding;
}

export const VgcStandingRow = (props: VgcStandingProps) => {
  return (
    <TableRow>
      <TableCell>{props.standing.placing}</TableCell>
      <TableCell>{props.standing.name}</TableCell>
      <TableCell>{formatRecord(props.standing.record)}</TableCell>
      <TableCell>{(props.standing.resistances.opp * 100).toPrecision(3)}</TableCell>
    </TableRow>
  )
}