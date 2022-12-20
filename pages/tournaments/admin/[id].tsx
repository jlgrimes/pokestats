import { getSession } from 'next-auth/react';
import Tournament from '../../../src/components/Tournament/Tournament';
import supabase from '../../../src/lib/supabase/client';

export default function TournamentPage({
  userIsAdmin,
  tournament,
}: {
  userIsAdmin: boolean;
  tournament: { id: string; name: string } | null;
}) {
  if (!tournament) {
    return <div>oopsies</div>
  }

  return (
    <Tournament
      tournament={tournament}
      allowEdits={userIsAdmin}
    />
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  const { data: administratorList } = await supabase
    .from('Administrators')
    .select('*');
  const userIsAdmin = administratorList?.some(
    admin => admin.email === session?.user?.email
  );

  const { data: tournaments } = await supabase
    .from('Tournaments')
    .select('id,name');
  console.log(context.query)
  const tournament = tournaments?.find(
    tournament => tournament.id === context.query.id
  ) ?? null;

  return {
    props: { userIsAdmin, tournament },
  };
}