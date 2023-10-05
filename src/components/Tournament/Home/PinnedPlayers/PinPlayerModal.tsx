import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  Input,
  UseDisclosureProps,
  useToast,
} from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { Tournament } from '../../../../../types/tournament';
import {
  addPinnedPlayer,
  useAvailablePinnedPlayerNames,
  usePinnedPlayers,
} from '../../../../hooks/pinnedPlayers';
import { PlayerSelectModal } from './PlayerSelectModal';
import { AgeDivision } from '../../../../../types/age-division';

interface PinPlayerModalProps {
  tournament: Tournament;
  ageDivision: AgeDivision;
  modalControls: UseDisclosureProps;
}

export const PinPlayerModal = (props: PinPlayerModalProps) => {
  const user = useUser();
  const toast = useToast();

  const { data: availablePinnedPlayerNames } = useAvailablePinnedPlayerNames(
    props.tournament,
    props.ageDivision
  );
  const { refetch } = usePinnedPlayers();

  const handleSubmit = useCallback(
    async (player: string) => {
      if (!user?.email) {
        return toast({
          status: 'error',
          title: 'Session invalid',
        });
      }

      const res = await addPinnedPlayer(
        props.tournament.id,
        user.email,
        player
      );

      if (res.error) {
        return toast({
          status: 'error',
          title: `Error favoriting ${player}`,
          description: res.error.message,
        });
      }

      // toast({
      //   status: 'success',
      //   title: `Favorited ${player}!`,
      // });

      props.modalControls.onClose && props.modalControls.onClose();
      await refetch();
    },
    [user?.email, refetch, toast, props.modalControls, props.tournament.id]
  );

  return (
    <PlayerSelectModal
      tournament={props.tournament}
      modalControls={props.modalControls}
      playerNames={availablePinnedPlayerNames ?? []}
      handleSubmit={handleSubmit}
    />
  );
};
