import { useSession } from "next-auth/react"

export const useUserMatchesLoggedInUser = (name: string) => {
  const session = useSession();
  return session.data?.user.name === name;
}