import { useUserIsAdmin } from "./administrators"
import { useIsUserPatron } from "./patreon";

export const useShouldRemoveAds = () => {
  const { data: isAdmin, isUserMocked } = useUserIsAdmin();
  const isUserPatron = useIsUserPatron();

  if (isAdmin || isUserMocked) return true;

  return isUserPatron;
}