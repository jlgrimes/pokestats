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
import { useStreamLink } from '../../../hooks/tournamentMetadata';
import { AdminBadge } from '../../common/AdminBadge';
import AddArchetypeModal from '../../Deck/DeckInput/ArchetypeSelector/AddArchetypeModal';
import { getRK9TournamentUrl } from '../helpers';
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
  const { data: streamLink } = useStreamLink(props.tournament.id);
  const router = useRouter();
  const { data: userIsAdmin } = useUserIsAdmin();

  const playerSelectModalControls = useDisclosure();
  const addArchetypeModalControls = useDisclosure();

  const streamIsLive = props.tournament.tournamentStatus === 'running';

  return (
    <Grid gridTemplateColumns='1fr 1fr' gap={2} rowGap={2}>
      {streamLink && (
        <Button
          {...commonProps}
          colorScheme='purple'
          leftIcon={<FaTwitch />}
          as={NextLink}
          href={streamLink}
          target='_blank'
          variant={streamIsLive ? 'solid' : 'outline'}
        >
          Stream
        </Button>
      )}
      <Button
        {...commonProps}
        rightIcon={<ExternalLinkIcon />}
        as={NextLink}
        href={getRK9TournamentUrl(props.tournament.rk9link)}
        target='_blank'
      >
        Tournament info
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
      <Button
        {...commonProps}
        as={NextLink}
        href={
          props.tournament.tournamentStatus !== 'not-started'
            ? `${router.asPath}/pairings`
            : '#'
        }
        isDisabled={props.tournament.tournamentStatus === 'not-started'}
      >
        Pairings
      </Button>
      {userIsAdmin && (
        <Fragment>
          <Button
            {...commonProps}
            variant='outline'
            colorScheme='pink'
            onClick={() =>
              props.tournament.tournamentStatus !== 'not-started' &&
              playerSelectModalControls.onOpen
            }
            isDisabled={props.tournament.tournamentStatus === 'not-started'}
            leftIcon={<FaPen />}
          >
            Report player
          </Button>
          <Button
            {...commonProps}
            variant='outline'
            colorScheme='pink'
            onClick={() =>
              props.tournament.tournamentStatus !== 'not-started' &&
              addArchetypeModalControls.onOpen
            }
            isDisabled={props.tournament.tournamentStatus === 'not-started'}
            leftIcon={<FaDog />}
          >
            Add new deck
          </Button>
          <ReportModal
            tournament={props.tournament}
            playerSelectModalControls={playerSelectModalControls}
          />
          {addArchetypeModalControls.isOpen && (
            <AddArchetypeModal
              isOpen={addArchetypeModalControls.isOpen}
              onClose={addArchetypeModalControls.onClose}
            />
          )}
        </Fragment>
      )}
    </Grid>
  );
};
