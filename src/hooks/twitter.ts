import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { isMobileDevice } from "../lib/userAgent";

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
  const id = session?.user?.id as string;

  return useQuery({
    queryKey: [`twitter-username-for${id}`],
    queryFn: () => fetchTwitterProfile({ id })
  })
}

export const useTwitterLink = (twitterHandle: string) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const twitterLink = useMemo(
    () =>
      `${isMobile ? 'twitter://user?screen_name=' : 'https://twitter.com/'}${
        twitterHandle
      }`,
    [twitterHandle, isMobile]
  );

  return twitterLink;
}