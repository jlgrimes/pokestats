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
import { useCallback, useMemo, useState } from 'react';
import { Tournament } from '../../../../../types/tournament';

interface PinPlayerModalProps {
  tournament: Tournament;
  modalControls: UseDisclosureProps;
  playerNames: string[];
  handleSubmit: (name: string) => void;
}

export const PlayerSelectModal = (props: PinPlayerModalProps) => {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (e: Record<string, any>) => {
    setFilter(e.target.value);
  };

  const filteredPlayerProfiles = useMemo(() => {
    return props.playerNames?.filter((name: string) =>
      name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, props.playerNames]);

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
          <Input placeholder='Filter name' onChange={handleFilterChange} autoFocus />
          <Stack height={'220px'} overflowY={'scroll'} padding={4}>
            {filteredPlayerProfiles?.map((player, idx) => (
              <div key={idx} onClick={() => props.handleSubmit(player)}>
                {player}
              </div>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
