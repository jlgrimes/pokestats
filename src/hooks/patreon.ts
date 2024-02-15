import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import supabase from "../lib/supabase/client";

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

const fetchPatronExceptions = async () => {
  const res = await supabase.from('Patreon Users').select('email');

  return res.data;
}

export const usePatronExceptions = () => {
  return useQuery({
    queryKey: ['pokestats-patron-exceptions'],
    queryFn: fetchPatronExceptions
  })
}

export const useIsUserPatron = () => {
  const user = useUser();
  const { data: patrons } = usePatrons();
  const { data: additionalPatrons } = usePatronExceptions();

  const userIsManuallyAddedToDb = user?.email && additionalPatrons?.some(({ email }) => email === user.email);
  return userIsManuallyAddedToDb || patrons?.some((patron: Record<any, any>) => patron.attributes.email === user?.email || patron.attributes.full_name === user?.user_metadata.name);
}