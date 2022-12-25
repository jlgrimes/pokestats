import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react";

export const fetchTwitterProfile = async ({ id, username }: { id?: string, username?: string}) => {
  let queryParam = '';
  if (id) {
    queryParam = `id=${id}`
  } else if (username) {
    queryParam = `username=${username}`
  } else {
    return '';
  }

  const res = await fetch(`/api/get-twitter-profile?${queryParam}`)
  const data = await res.json();
  return data.username;
}

export const useTwitterUsername = () => {
  const { data: session } = useSession();
  const id = session?.user?.email as string;

  return useQuery({
    queryKey: [`twitter-username-for${id}`],
    queryFn: () => fetchTwitterProfile({ id })
  })
}