import { Button, Grid, useDisclosure } from '@chakra-ui/react';
import { Fragment } from 'react';
import { FaPen } from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { OpenEditTournamentInfo } from '../../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import { CommonCard } from '../../common/CommonCard';
import { ReportModal } from './ReportModal';

interface AdminTournamentPanelProps {
  tournament: Tournament;
}

export const AdminTournamentPanel = (props: AdminTournamentPanelProps) => {
  const playerSelectModalControls = useDisclosure();

  return (
    <CommonCard header='Admin actions' ghost>
      <Grid gridTemplateColumns={'1fr 1fr'} gap='2'>
        <Button
          onClick={playerSelectModalControls.onOpen}
          isDisabled={props.tournament.tournamentStatus === 'not-started'}
          leftIcon={<FaPen />}
          variant='outline'
        >
          Report
        </Button>
        <ReportModal
          tournament={props.tournament}
          playerSelectModalControls={playerSelectModalControls}
        />
        <OpenEditTournamentInfo tournament={props.tournament} />
      </Grid>
    </CommonCard>
  );
};
