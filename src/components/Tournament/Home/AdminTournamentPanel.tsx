import { Button, Grid, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Fragment } from 'react';
import { FaDog, FaPencilAlt, FaUserFriends } from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { OpenEditTournamentInfo } from '../../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import { CommonCard } from '../../common/CommonCard';
import AddArchetypeModal from '../../Deck/DeckInput/ArchetypeSelector/AddArchetypeModal';
import { ReportModal } from './ReportModal';
import { AgeDivision } from '../../../../types/age-division';

interface AdminTournamentPanelProps {
  tournament: Tournament;
  ageDivision: AgeDivision;
}

export const AdminTournamentPanel = (props: AdminTournamentPanelProps) => {
  const playerSelectModalControls = useDisclosure();
  const addArchetypeModalControls = useDisclosure();

  return (
    <CommonCard header='Admin actions' ghost>
      <Grid gridTemplateColumns={'1fr 1fr'} gap='2'>
        <OpenEditTournamentInfo tournament={props.tournament} />
        <ReportModal
          tournament={props.tournament}
          playerSelectModalControls={playerSelectModalControls}
        />
        <Button onClick={addArchetypeModalControls.onOpen} leftIcon={<FaDog />}>
          Add new deck
        </Button>
        <Button
          as={NextLink}
          href={`/tournaments/${props.tournament.id}/${props.ageDivision}/pairings`}
          isDisabled={props.tournament.tournamentStatus === 'not-started'}
          leftIcon={<FaUserFriends />}
        >
          Report tables
        </Button>
        <Button
          onClick={playerSelectModalControls.onOpen}
          isDisabled={props.tournament.tournamentStatus === 'not-started'}
          colorScheme='pink'
          leftIcon={<FaPencilAlt />}
        >
          Report deck
        </Button>
        <AddArchetypeModal
          isOpen={addArchetypeModalControls.isOpen}
          onClose={addArchetypeModalControls.onClose}
          tournament={props.tournament}
        />
      </Grid>
    </CommonCard>
  );
};
