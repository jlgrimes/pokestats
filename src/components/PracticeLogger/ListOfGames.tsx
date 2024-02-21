import { GameLog, useGameLogs } from "./useGameLogs"
import { GameModalPreview } from "./GameModalPreview";

export const ListOfGames = () => {
  const { data: gameLogs } = useGameLogs();

  return (
    <div className="flex flex-col gap-2">
      {gameLogs?.map((game: GameLog) => (
        <GameModalPreview key={game.id} gameLog={game} />
      ))}
    </div>
  )
}