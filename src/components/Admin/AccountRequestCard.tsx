import { CheckIcon, EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Card,
  CardHeader,
  Heading,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { FaLink } from 'react-icons/fa';
import { GiLeatherBoot } from 'react-icons/gi';
import supabase from '../../lib/supabase/client';
import { SelectPlayerModal } from './SelectPlayerModal';

export const AccountRequestCard = ({
  request,
}: {
  request: Record<string, any>;
}) => {
  const modalControls = useDisclosure();
  const [associatedName, setAssociatedName] = useState<string | null>(null);
  const [linkUsersInProgress, setLinkUsersInProgress] = useState(false);
  const [bootInProgress, setBootInProgress] = useState(false);
  const [shouldHideCard, setShouldHideCard] = useState(false);

  const toast = useToast();

  const handleModalSubmit = (name: string) => {
    setAssociatedName(name);
    modalControls.onClose();
  };

  const handleLinkClick = async () => {
    setLinkUsersInProgress(true);
    const { error: updateError } = await supabase
      .from('Player Profiles')
      .update({
        email: request.email,
      })
      .eq('name', associatedName);

    if (updateError) {
      setLinkUsersInProgress(false);
      toast({
        status: 'error',
        title: updateError.message,
        description: updateError.details,
      });
      return;
    }

    const { error: deleteError } = await supabase
      .from('Account Requests')
      .delete()
      .eq('email', request.email);

    if (deleteError) {
      setLinkUsersInProgress(false);
      toast({
        status: 'error',
        title: deleteError.message,
        description: deleteError.details,
      });
      return;
    }

    setLinkUsersInProgress(false);
    setShouldHideCard(true);
    toast({
      status: 'success',
      title: 'User linked successfully!',
      description: `${request.email} + ${associatedName}`,
    });
  };

  const handleBootClick = useCallback(async () => {
    setBootInProgress(true);
    const { error: deleteError } = await supabase
      .from('Account Requests')
      .delete()
      .eq('email', request.email);

    if (deleteError) {
      setLinkUsersInProgress(false);
      toast({
        status: 'error',
        title: deleteError.message,
        description: deleteError.details,
      });
      return;
    }

    setBootInProgress(false);
    setShouldHideCard(true);

    toast({
      status: 'success',
      title: 'User booted!',
      description: `${request.email} + ${associatedName}`,
    });
  }, [associatedName, request.email, toast]);

  return !shouldHideCard ? (
    <Card>
      <CardHeader>
        <Heading size={'md'}>{request.email}</Heading>
        <Text>Name: {request.name}</Text>
      </CardHeader>
      <Button
        onClick={() => {
          modalControls.onOpen();
        }}
        rightIcon={<EditIcon />}
      >
        {associatedName ?? 'Associate with RK9 player'}
      </Button>
      <Button
        colorScheme={'green'}
        isLoading={linkUsersInProgress}
        loadingText='Link users'
        disabled={!associatedName}
        onClick={handleLinkClick}
        rightIcon={<FaLink />}
      >
        Link users
      </Button>
      <Button
        colorScheme={'red'}
        isLoading={bootInProgress}
        loadingText='Bootin'
        onClick={handleBootClick}
        rightIcon={<GiLeatherBoot />}
      >
        Give em the boot!
      </Button>
      {modalControls.isOpen && (
        <SelectPlayerModal
          modalControls={modalControls}
          handleSubmit={handleModalSubmit}
        />
      )}
    </Card>
  ) : null;
};
