import { GameLog, useGameLogs } from "./useGameLogs"
import { GameModalPreview } from "./GameModalPreview";
import { Text, Title } from "@tremor/react";

export const ListOfGames = () => {
  const { data: gameLogs } = useGameLogs();

  return (
    <div className="flex flex-col gap-2">
      <Title>My games</Title>
      {gameLogs?.length === 0 && <Text>Add a game to get started</Text>}
      {gameLogs?.map((game: GameLog) => (
        <GameModalPreview key={game.id} gameLog={game} />
      ))}
    </div>
  )
}