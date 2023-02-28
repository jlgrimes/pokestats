import { EditIcon } from '@chakra-ui/icons';
import { Button, IconButton, useDisclosure } from '@chakra-ui/react';
import { Fragment } from 'react';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { EditTournamentInfoModal } from './EditTournamentInfoModal';

export const OpenEditTournamentInfo = ({
  tournament,
}: {
  tournament: Tournament;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: userIsAdmin } = useUserIsAdmin();

  if (!userIsAdmin) return null;

  return (
    <Fragment>
      <Button onClick={onOpen} variant='outline'>
        Edit event
      </Button>
      {isOpen && (
        <EditTournamentInfoModal
          isOpen={isOpen}
          onClose={onClose}
          tournament={tournament}
        />
      )}
    </Fragment>
  );
};
