import { Button, Grid, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';
import { FaDog, FaPenFancy, FaTwitch } from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { useStreamLink } from '../../../hooks/tournamentMetadata';
import AddArchetypeModal from '../../Deck/DeckInput/ArchetypeSelector/AddArchetypeModal';
import { getRK9TournamentUrl } from '../helpers';
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
  const streamLink = useStreamLink(props.tournament.id);
  const router = useRouter();
  const { data: userIsAdmin } = useUserIsAdmin();

  const playerSelectModalControls = useDisclosure();
  const addArchetypeModalControls = useDisclosure();

  return (
    <Grid gridTemplateColumns='1fr 1fr' gap={2} rowGap={2}>
      {streamLink && (
        <Button
          {...commonProps}
          colorScheme='purple'
          leftIcon={<FaTwitch />}
          as={NextLink}
          href={streamLink.data}
          target='_blank'
        >
          Stream
        </Button>
      )}
      <Button
        {...commonProps}
        as={NextLink}
        href={getRK9TournamentUrl(props.tournament.rk9link)}
        target='_blank'
      >
        Tournament Info
      </Button>
      <Button
        {...commonProps}
        as={NextLink}
        href={`${router.asPath}/standings`}
        isDisabled={props.tournament.tournamentStatus === 'not-started'}
      >
        Standings
      </Button>
      <Button
        {...commonProps}
        as={NextLink}
        href={`${router.asPath}/pairings`}
        isDisabled={props.tournament.tournamentStatus === 'not-started'}
      >
        Pairings
      </Button>
      {userIsAdmin && (
        <Fragment>
          <Button
            {...commonProps}
            onClick={playerSelectModalControls.onOpen}
            isDisabled={props.tournament.tournamentStatus === 'not-started'}
            leftIcon={<FaPenFancy />}
          >
            Report player
          </Button>
          <Button
            {...commonProps}
            onClick={addArchetypeModalControls.onOpen}
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
