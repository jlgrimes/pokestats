import { Card } from "@tremor/react";
import { useGameLogs } from "./useGameLogs"

export const ListOfGames = () => {
  const { data: gameLogs } = useGameLogs();

  return (
    <div>
      {gameLogs?.map((game) => (
        <Card key={game.id}>
          {game.created_at}
        </Card>
      ))}
    </div>
  )
}