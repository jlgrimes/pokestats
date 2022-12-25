import { useQuery } from "@tanstack/react-query"

export const useTwitterUsernameFromId = (id: string) => {
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