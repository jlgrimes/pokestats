import { EditIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure } from '@chakra-ui/react';
import { Fragment } from 'react';
import { Tournament } from '../../../../types/tournament';
import { EditTournamentInfoModal } from './EditTournamentInfoModal';

export const OpenEditTournamentInfo = ({
  tournament,
}: {
  tournament: Tournament;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Fragment>
      <IconButton aria-label='edit tournament info' onClick={onOpen} size='sm' variant='outline'>
        <EditIcon />
      </IconButton>
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
