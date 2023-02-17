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
import { useSession } from 'next-auth/react';
import { useCallback, useMemo, useState } from 'react';
import { Tournament } from '../../../../../types/tournament';
import {
  addPinnedPlayer,
  useAvailablePinnedPlayerNames,
  usePinnedPlayers,
} from '../../../../hooks/pinnedPlayers';
import { PlayerSelectModal } from './PlayerSelectModal';

interface PinPlayerModalProps {
  tournament: Tournament;
  modalControls: UseDisclosureProps;
}

export const PinPlayerModal = (props: PinPlayerModalProps) => {
  const session = useSession();
  const toast = useToast();

  const { data: availablePinnedPlayerNames } = useAvailablePinnedPlayerNames(
    props.tournament.id
  );
  const { refetch } = usePinnedPlayers(props.tournament.id);

  const handleSubmit = useCallback(
    async (player: string) => {
      if (!session.data?.user?.email) {
        return toast({
          status: 'error',
          title: 'Session invalid',
        });
      }

      const res = await addPinnedPlayer(
        props.tournament.id,
        session.data.user.email,
        player
      );

      if (res.error) {
        return toast({
          status: 'error',
          title: `Error pinning ${player}`,
          description: res.error.message,
        });
      }

      props.modalControls.onClose && props.modalControls.onClose();
      await refetch();
    },
    [
      session.data?.user?.email,
      refetch,
      toast,
      props.modalControls,
      props.tournament.id,
    ]
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
