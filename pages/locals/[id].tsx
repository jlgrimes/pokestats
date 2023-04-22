import { Button, Heading, Input, Stack, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { LocalReportModal } from '../../src/components/Locals/LocalReportModal';
import { ReportModal } from '../../src/components/Tournament/Home/ReportModal';
import { useUserIsAdmin } from '../../src/hooks/administrators';
import { fetchLocalTournaments, LocalTournament } from '../../src/hooks/locals';
import { Tournament } from '../../types/tournament';

interface LocalsPageProps {
  tournament: LocalTournament;
}

export default function LocalsPage(props: LocalsPageProps) {
  const { data: userIsAdmin } = useUserIsAdmin();
  const [name, setName] = useState('');
  const modalControls = useDisclosure();

  return (
    <Stack>
      <Heading>{props.tournament.name}</Heading>
      {userIsAdmin && (
        <Stack>
          <Input
            placeholder='Enter player name'
            onChange={e => setName(e.target.value)}
          />
          <Button onClick={() => modalControls.onOpen()}>
            Report player deck
          </Button>
          <LocalReportModal
            modalControls={modalControls}
            playerName={name}
            tournament={props.tournament}
          />
        </Stack>
      )}
    </Stack>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const tournament = await fetchLocalTournaments({ id: parseInt(params.id) });

  return {
    props: {
      tournament: tournament?.[0],
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchLocalTournaments();
  const paths = tournaments?.map(tournament => ({
    params: { id: `${tournament.id}` },
  }));

  return {
    paths,
    fallback: true, // can also be true or 'blocking'
  };
}
