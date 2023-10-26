import { Bold, TableCell, TableRow } from "@tremor/react";
import { VgcStanding } from "./useVgcStandings";
import { formatRecord } from "../../components/Tournament/Results/ResultsList/helpers";
import { MatchPoints } from "../../components/Tournament/Results/ResultsList/MatchPoints";
import { Standing } from "../../../types/tournament";

interface VgcStandingProps {
  standing: VgcStanding;
  shouldShowMatchPoints: boolean;
}

export const VgcStandingRow = (props: VgcStandingProps) => {
  return (
    <TableRow className="h-10 align-middle">
      <td>{props.standing.placing}</td>
      <td>{props.standing.name}</td>
      <td className="pr-2">{props.shouldShowMatchPoints ? <MatchPoints standing={props.standing as unknown as Standing} /> : formatRecord(props.standing.record)}</td>
      <td>{(props.standing.resistances.opp * 100).toPrecision(3)}</td>
    </TableRow>
  )
}