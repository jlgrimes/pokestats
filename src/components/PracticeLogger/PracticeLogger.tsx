import { useSessionPlayerProfile } from "../../hooks/user"
import { LogInOutButton } from "../Layout/AppBar/LogInOutButton";
import { NewLogInput } from "./NewLogInput";
import { PtcgLiveNameInput } from "./PtcgLiveNameInput";

export const PracticeLogger = () => {
  const { data: user, isAuthenticated } = useSessionPlayerProfile();

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
    <div className="mt-2">
      <NewLogInput />
    </div>
  )
}