import { useSuggestedUserProfile } from "../../hooks/user";
import { RecommendedSuggestedUser } from "./RecommendSuggestedUser";

export const SetupProfileController = () => {
  const { data: suggestedUser } = useSuggestedUserProfile();

  if (suggestedUser) return <RecommendedSuggestedUser />

  return null;
}