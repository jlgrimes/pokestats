import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Stack,
  Heading,
  Text,
} from '@chakra-ui/react';

interface ListViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: Record<any, any>;
}

export const ListViewerModal = (props: ListViewerModalProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='xl'>
      <ModalOverlay />
      <ModalContent marginTop={{ base: '0', sm: '16' }}>
        <ModalHeader>{`${props.result.name} - ${props.result.deck.name}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack direction={'row'}>
            {['Pokemon', 'Trainer', 'Energy'].map((superclass, idx) => (
              <Stack key={idx}>
                <Heading size='sm'>{superclass}</Heading>
                {props.result.deck.list[superclass.toLowerCase()].map(
                  (card: Record<string, any>, textIdx: number) => (
                    <Text
                      key={textIdx}
                    >{`${card.count} ${card.name}`}</Text>
                  )
                )}
              </Stack>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
