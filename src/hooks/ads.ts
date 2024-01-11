import { useUserIsAdmin } from "./administrators"

export const useShouldRemoveAds = () => {
  const { data: isAdmin, isUserMocked } = useUserIsAdmin();

  if (isAdmin || isUserMocked) return true;

  return false;
}