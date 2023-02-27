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
  FaTwitch,
} from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import AddArchetypeModal from '../../Deck/DeckInput/ArchetypeSelector/AddArchetypeModal';
import { getRK9TournamentUrl } from '../helpers';
import { StreamLink } from '../TournamentLinks';
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

  const playerSelectModalControls = useDisclosure();

  return (
    <Grid gridTemplateColumns='1fr 1fr 1fr' gap={2} rowGap={2}>
      <StreamLink tournament={props.tournament} />
      <Button
        {...commonProps}
        as={NextLink}
        href={getRK9TournamentUrl(props.tournament.rk9link)}
        target='_blank'
      >
        Info
      </Button>
      <Button
        {...commonProps}
        as={NextLink}
        href={getRK9TournamentUrl(props.tournament.rk9link, 'pairings')}
        isDisabled={props.tournament.tournamentStatus === 'not-started'}
      >
        Pairings
      </Button>
      <Button
        {...commonProps}
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
      {userIsAdmin && (
        <Fragment>
          <Button
            {...commonProps}
            variant='solid'
            colorScheme='pink'
            onClick={playerSelectModalControls.onOpen}
            isDisabled={props.tournament.tournamentStatus === 'not-started'}
            leftIcon={<FaPen />}
          >
            Report
          </Button>
          <ReportModal
            tournament={props.tournament}
            playerSelectModalControls={playerSelectModalControls}
          />
        </Fragment>
      )}
    </Grid>
  );
};
