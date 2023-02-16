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

interface PinPlayerModalProps {
  tournament: Tournament;
  modalControls: UseDisclosureProps;
}

export const PinPlayerModal = (props: PinPlayerModalProps) => {
  const session = useSession();
  const toast = useToast();

  const [filter, setFilter] = useState('');
  const { data: availablePinnedPlayerNames } = useAvailablePinnedPlayerNames(
    props.tournament.id
  );
  const { refetch } = usePinnedPlayers(props.tournament.id);

  const handleFilterChange = (e: Record<string, any>) => {
    setFilter(e.target.value);
  };

  const filteredPlayerProfiles = useMemo(() => {
    return availablePinnedPlayerNames?.filter((name: string) =>
      name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, availablePinnedPlayerNames]);

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

      return toast({
        status: 'success',
        title: `Successfully pinned ${player}`,
      });
    },
    [session.data?.user?.email, refetch, toast]
  );

  return (
    <Modal
      isOpen={!!props.modalControls.isOpen}
      onClose={props.modalControls.onClose ?? (() => {})}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select player name</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder='Filter name' onChange={handleFilterChange} />
          <Stack height={'220px'} overflowY={'scroll'} padding={4}>
            {filteredPlayerProfiles?.map((player, idx) => (
              <div key={idx} onClick={() => handleSubmit(player)}>
                {player}
              </div>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
