import { CommonCard } from "../common/CommonCard"
import { TopPlayersList } from "../TopPlayers/TopPlayersList"

export const LeaderboardCard = () => {
  return (
    <CommonCard header='Masters Leaderboard' subheader="2023, Global" ghost>
      <TopPlayersList isCompact season={46} />
    </CommonCard>
  )
}