import Tournament from '../../src/components/Tournament/Tournament';
import supabase from '../../src/lib/supabase/client';

export default function TournamentPage({
  tournament,
}: {
  tournament: { id: string; name: string };
}) {
  return <Tournament tournament={tournament} allowEdits={false} />;
}

export async function getStaticProps({
  params,
}: {
  params: { id: string };
}) {
  return {
    props: { tournament: params },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const { data: tournaments } = await supabase
    .from('Tournaments')
    .select('id,name');
  const paths = tournaments?.map(tournament => ({
    params: {
      id: tournament.id,
      displayName: tournament.name
    },
  }));
  console.log(paths)

  return {
    paths,
    fallback: false,
  };
}
