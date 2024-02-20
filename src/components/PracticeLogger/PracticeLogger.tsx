import { useSessionPlayerProfile } from "../../hooks/user"
import { LogInOutButton } from "../Layout/AppBar/LogInOutButton";
import { FullPageLoader } from "../common/FullPageLoader";
import { ListOfGames } from "./ListOfGames";
import { NewLogInput } from "./NewLogInput";
import { PtcgLiveNameInput } from "./PtcgLiveNameInput";

export const PracticeLogger = () => {
  const { data: user, isLoading, isAuthenticated } = useSessionPlayerProfile();

  if (isLoading) return <FullPageLoader />;

  if (!isAuthenticated) {
    return (
      <span>
        Please <LogInOutButton /> first to use the practice logger!
      </span>
    )
  }

  if (!user?.ptcg_live_name) {
    return (
      <div>
        <PtcgLiveNameInput />
      </div>
    )
  }

  return (
    <div className="mt-2 flex flex-col gap-8">
      <NewLogInput />
      <ListOfGames />
    </div>
  )
}