import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

const fetchPatrons = async () => {
  const res = await fetch('/api/patreon-pledges');
  const data = await res.json();

  return data['included'];
}

export const usePatrons = () => {
  return useQuery({
    queryKey: ['pokestats-patrons'],
    queryFn: fetchPatrons
  })
}

export const useIsUserPatron = () => {
  const user = useUser();
  const { data: patrons } = usePatrons();

  return patrons?.some((patron: Record<any, any>) => patron.attributes.email === user?.email || patron.attributes.full_name === user?.user_metadata.name);
}