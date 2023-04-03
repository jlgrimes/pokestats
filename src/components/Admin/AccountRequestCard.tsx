import { CheckIcon, EditIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { format, formatDistance, parseISO } from 'date-fns';
import { useCallback, useState } from 'react';
import { FaLink } from 'react-icons/fa';
import { GiLeatherBoot } from 'react-icons/gi';
import supabase from '../../lib/supabase/client';
import { SelectPlayerModal } from './SelectPlayerModal';

export const AccountRequestCard = ({
  request,
  unusedPlayers
}: {
  request: Record<string, any>;
  unusedPlayers: string[]
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
    const { error: insertError } = await supabase
      .from('Player Profiles')
      .insert({
        name: associatedName,
        email: request.email,
      });

    if (insertError) {
      setLinkUsersInProgress(false);
      toast({
        status: 'error',
        title: insertError.message,
        description: insertError.details,
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
        <Text>{format(parseISO(request.created_at), 'k:mm:ss MMM d y')}</Text>
        <Heading size={'md'}>{request.email}</Heading>
        <Text>Name: {request.name}</Text>
        <Text>Entered Name: {request.entered_name}</Text>
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
        onClick={() => {
          setAssociatedName(request.entered_name);
        }}
      >
        {'Associate with the name they inputted'}
      </Button>
      <Grid gridTemplateColumns={'1fr 1fr'}>
        <Button
          colorScheme={'green'}
          isLoading={linkUsersInProgress}
          loadingText='Link users'
          isDisabled={!associatedName}
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
      </Grid>
      {modalControls.isOpen && (
        <SelectPlayerModal
          modalControls={modalControls}
          handleSubmit={handleModalSubmit}
          unusedPlayers={unusedPlayers}
        />
      )}
    </Card>
  ) : null;
};
