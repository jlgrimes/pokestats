import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react";

export const fetchUsername = async (id: string) => {
  const res = await fetch(`/api/get-twitter-profile?id=${id}`)
  const data = await res.json();
  return data.username;
}

export const useTwitterUsername = () => {
  const { data: session } = useSession();
  const id = session?.user?.email as string;

  return useQuery({
    queryKey: [`twitter-username-for${id}`],
    queryFn: () => fetchUsername(id)
  })
}