import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react";

export const useTwitterUsername = () => {
  const { data: session } = useSession();
  const id = session?.user?.email as string;

  const fetchUsername = async () => {
    const res = await fetch(`/api/twitterUsernameFromId?id=${id}`)
    const data = await res.json();
    return data.username;
  }
  return useQuery({
    queryKey: [`twitter-username-for${id}`],
    queryFn: fetchUsername
  })
}