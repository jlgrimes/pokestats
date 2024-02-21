import { Text } from "@tremor/react";
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
      <div className="flex flex-col gap-8 text-center">
        <LogInOutButton />
        <Text>Pokestats Live requires you to have a user account to use the practice logger.</Text>
      </div>
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