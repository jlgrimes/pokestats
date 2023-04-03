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
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useNotSetupProfiles } from '../../hooks/user';

export const SelectPlayerModal = ({
  modalControls,
  handleSubmit,
  unusedPlayers,
}: {
  modalControls: UseDisclosureProps;
  handleSubmit: (name: string) => void;
  unusedPlayers: string[];
}) => {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (e: Record<string, any>) => {
    setFilter(e.target.value);
  };

  const filteredPlayerProfiles = useMemo(() => {
    return unusedPlayers?.filter((name: string) =>
      name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, unusedPlayers]);

  return (
    <Modal
      isOpen={!!modalControls.isOpen}
      onClose={modalControls.onClose ?? (() => {})}
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
