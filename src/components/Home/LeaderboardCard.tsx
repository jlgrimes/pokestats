import { CommonCard } from "../common/CommonCard"
import { TopPlayersList } from "../TopPlayers/TopPlayersList"

export const LeaderboardCard = () => {
  return (
    <CommonCard header='2023 Leaderboard' ghost>
      <TopPlayersList isCompact season={46} />
    </CommonCard>
  )
}