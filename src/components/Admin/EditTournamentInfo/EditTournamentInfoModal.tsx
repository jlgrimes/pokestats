import {
  Button,
  Grid,
  HStack,
  Menu,
  MenuItemOption,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { QueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Tournament } from '../../../../types/tournament';
import { useTournamentMetadata } from '../../../hooks/tournamentMetadata';
import supabase from '../../../lib/supabase/client';

export const EditTournamentInfoModal = ({
  isOpen,
  onClose,
  tournament,
}: {
  isOpen: boolean;
  onClose: () => void;
  tournament: Tournament;
}) => {
  const toast = useToast();
  const { data: streamInfo } = useTournamentMetadata(tournament.id, 'stream');
  const streamUrlFromSupa = streamInfo?.at(0)?.data;

  const [streamUrlEnabled, setStreamUrlEnabled] = useState(!!streamUrlFromSupa);
  const [streamUrl, setStreamUrl] = useState(streamUrlFromSupa);

  const handleSubmit = useCallback(async () => {
    const queryClient = new QueryClient();

    if (streamUrlFromSupa) {
      const res = await supabase
        .from('Tournament Metadata')
        .update({
          data: streamUrl,
        })
        .match({ tournament: tournament.id });
      if (res.error) {
        return toast({
          status: 'error',
          title: 'Error updating',
          description: res.error.message,
        });
      }
      onClose();
    } else {
      const res = await supabase.from('Tournament Metadata').insert({
        tournament: tournament.id,
        data: streamUrl,
      });
      if (res.error) {
        return toast({
          status: 'error',
          title: 'Error inserting',
          description: res.error.message,
        });
      }
    }
  
    toast({
      status: 'success',
      title: 'Success updating stream!',
    });
    queryClient.setQueryData(
      ['tournament-metadata', tournament.id, 'stream'],
      [
        {
          tournament: tournament.id,
          data: streamUrl,
        },
      ]
    );
    onClose();
  }, [onClose, streamUrl, streamUrlFromSupa, toast, tournament.id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit tournament info</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid gridTemplateColumns={'1fr 1fr'}>
            <HStack>
              <Text>Stream Link</Text>
              <Switch
                isChecked={streamUrlEnabled}
                onChange={() => setStreamUrlEnabled(!streamUrlEnabled)}
              />
            </HStack>
            <HStack>
              <RadioGroup
                onChange={value => setStreamUrl(value)}
                value={streamUrl}
                isDisabled={!streamUrlEnabled}
              >
                <Stack>
                  <Radio value='https://www.twitch.tv/pokemontcg'>
                    Pokemon TCG Twitch
                  </Radio>
                  <Radio value='https://www.twitch.tv/limitless_tcg'>
                    Limitless Twitch
                  </Radio>
                </Stack>
              </RadioGroup>
            </HStack>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={
              (!streamUrlEnabled && !streamUrlFromSupa) ||
              (streamUrlEnabled && streamUrl === streamUrlFromSupa)
            }
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
