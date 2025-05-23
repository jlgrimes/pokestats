import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  ButtonProps,
  Grid,
  HStack,
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
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
  FaUserFriends,
} from 'react-icons/fa';
import { IoMdPodium } from 'react-icons/io';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { OpenEditTournamentInfo } from '../../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import AddArchetypeModal from '../../Deck/DeckInput/ArchetypeSelector/AddArchetypeModal';
import { getRK9TournamentUrl } from '../helpers';
import { trackEvent } from '../../../lib/track';

interface TournamentHomeLinksProps {
  tournament: Tournament;
}

export const TournamentHomeLinks = (props: TournamentHomeLinksProps) => {
  const commonProps: Partial<ButtonProps> = useMemo(
    () => ({
      colorScheme: 'gray',
      variant: 'outline',
      borderRadius: 0,
      size: 'lg'
    }),
    []
  );
  const router = useRouter();
  const { data: userIsAdmin } = useUserIsAdmin();

  return (
    <Grid gridTemplateColumns={'1fr 1fr'}>
      {/* <StreamLink tournament={props.tournament} /> */}
      <Button
        {...commonProps}
        as={NextLink}
        href={`${router.asPath}/masters/standings`}
        isDisabled={props.tournament.tournamentStatus === 'not-started'}
        onClick={() => trackEvent('Standings link clicked')}
      >
        Standings
      </Button>
      <Button
        {...commonProps}
        as={NextLink}
        href={getRK9TournamentUrl(props.tournament.rk9link, 'pairings')}
        target='_blank'
        onClick={() => trackEvent('RK9 pairings link clicked')}
      >
        <HStack spacing={1.5}>
          <Text>RK9 Pairings</Text>
        </HStack>
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
