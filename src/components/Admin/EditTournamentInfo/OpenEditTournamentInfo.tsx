import { EditIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure } from '@chakra-ui/react';
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
      <IconButton
        aria-label='edit tournament info'
        onClick={onOpen}
        size='md'
        variant='ghost'
        color='gray.500'
        padding={0}
        height='1'
      >
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
