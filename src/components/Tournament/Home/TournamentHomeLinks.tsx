import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, Grid, HStack, Text, useDisclosure } from '@chakra-ui/react';
import { IconExternalLink } from '@tabler/icons-react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';
import {
  FaDog,
  FaExternalLinkSquareAlt,
  FaPen,
  FaPenFancy,
  FaTrophy,
  FaTwitch,
} from 'react-icons/fa';
import { IoMdPodium } from 'react-icons/io';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { OpenEditTournamentInfo } from '../../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import AddArchetypeModal from '../../Deck/DeckInput/ArchetypeSelector/AddArchetypeModal';
import { getRK9TournamentUrl } from '../helpers';
import { StreamLink } from '../TournamentLinks';
import { AdminTournamentPanel } from './AdminTournamentPanel';
import { getTimeUntilTournament } from './helpers';
import { ReportModal } from './ReportModal';

interface TournamentHomeLinksProps {
  tournament: Tournament;
}

export const TournamentHomeLinks = (props: TournamentHomeLinksProps) => {
  const commonProps = useMemo(
    () => ({
      colorScheme: 'gray',
    }),
    []
  );
  const router = useRouter();
  const { data: userIsAdmin } = useUserIsAdmin();

  return (
    <Grid gridTemplateColumns='1fr 1fr 1fr' gap={2} rowGap={2}>
      <StreamLink tournament={props.tournament} />
      <Button
        {...commonProps}
        as={NextLink}
        href={getRK9TournamentUrl(props.tournament.rk9link, 'pairings')}
        target='_blank'
      >
        <HStack spacing={1.5}>
          <Text>Pairings</Text>
          <IconExternalLink size={16} />
        </HStack>
      </Button>
      <Button
        {...commonProps}
        as={NextLink}
        href={`${router.asPath}/standings`}
        isDisabled={props.tournament.tournamentStatus === 'not-started'}
      >
        Standings
      </Button>
      {/* <Button
        {...commonProps}
        as={NextLink}
        href={getRK9TournamentUrl(props.tournament.rk9link)}
        target='_blank'
      >
        Event info <ExternalLinkIcon mx='1' />
      </Button> */}
    </Grid>
  );
};
