import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, Grid, useDisclosure } from '@chakra-ui/react';
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
    <Grid gridTemplateColumns='1fr 1fr' gap={2} rowGap={2}>
      <StreamLink tournament={props.tournament} />
      <Button
        {...commonProps}
        leftIcon={<FaTrophy />}
        as={NextLink}
        href={
          props.tournament.tournamentStatus !== 'not-started'
            ? `${router.asPath}/standings`
            : '#'
        }
        isDisabled={props.tournament.tournamentStatus === 'not-started'}
      >
        Standings
      </Button>
      <Button
        {...commonProps}
        as={NextLink}
        href={getRK9TournamentUrl(props.tournament.rk9link)}
        target='_blank'
      >
        Event info <ExternalLinkIcon mx='1' />
      </Button>
      <Button
        {...commonProps}
        as={NextLink}
        href={getRK9TournamentUrl(props.tournament.rk9link, 'pairings')}
        isDisabled={props.tournament.tournamentStatus === 'not-started'}
        target='_blank'
      >
        Pairings <ExternalLinkIcon mx='1' />
      </Button>
    </Grid>
  );
};
