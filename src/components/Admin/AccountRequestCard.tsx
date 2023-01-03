import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Card,
  CardHeader,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { SelectPlayerModal } from './SelectPlayerModal';

export const AccountRequestCard = ({
  request,
}: {
  request: Record<string, any>;
}) => {
  const modalControls = useDisclosure();
  const [associatedName, setAssociatedName] = useState<string | null>(null);

  const handleSubmit = (name: string) => {
    setAssociatedName(name);
    modalControls.onClose();
  };

  return (
    <Card>
      <CardHeader>
        <Heading size={'md'}>{request.twitter_handle}</Heading>
        <Text>Name on Twitter: {request.twitter_full_name}</Text>
      </CardHeader>
      <Button
        size={'sm'}
        onClick={() => {
          modalControls.onOpen();
        }}
        rightIcon={<EditIcon />}
      >
        {associatedName ?? 'Associate with RK9 player'}
      </Button>
      {modalControls.isOpen && (
        <SelectPlayerModal
          modalControls={modalControls}
          handleSubmit={handleSubmit}
        />
      )}
    </Card>
  );
};
