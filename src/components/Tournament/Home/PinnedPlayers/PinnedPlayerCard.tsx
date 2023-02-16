import { Card, CardBody } from "@chakra-ui/react";
import { Standing } from "../../../../../types/tournament"
import { usePinnedPlayers } from "../../../../hooks/pinnedPlayers"

interface PinnedPlayerCardProps {
  player: Standing
}

export const PinnedPlayerCard = (props: PinnedPlayerCardProps) => {
  return <Card>
    <CardBody>
      
    </CardBody>
  </Card>
}