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
import { useCallback, useEffect, useState } from 'react';
import { Tournament } from '../../../../types/tournament';
import {
  useLocation,
  useStreamLink,
  useTournamentMetadata,
} from '../../../hooks/tournamentMetadata';
import supabase from '../../../lib/supabase/client';
import Autocomplete from 'react-google-autocomplete';

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
  const { data: streamLink, refetch } = useStreamLink(tournament);
  const { data: location } = useLocation(tournament);

  const [streamUrlEnabled, setStreamUrlEnabled] = useState(!!streamLink);
  const [streamUrl, setStreamUrl] = useState<string | undefined>(streamLink);
  const [place, setPlace] = useState<Record<string, any> | undefined>(location);

  useEffect(() => {
    setPlace(location);
  }, [location]);

  const handleSubmit = useCallback(
    async (type: 'stream' | 'location') => {
      if (
        (type === 'stream' && streamLink) ||
        (type === 'location' && location)
      ) {
        const res = await supabase
          .from('Tournament Metadata')
          .update({
            data: type === 'stream' ? streamUrl : place,
          })
          .match({ tournament: tournament.id, type });
        if (res.error) {
          return toast({
            status: 'error',
            title: 'Error updating ' + type,
            description: res.error.message,
          });
        }
        onClose();
      } else {
        const res = await supabase.from('Tournament Metadata').insert({
          tournament: tournament.id,
          type,
          data: type === 'stream' ? streamUrl : place,
        });
        if (res.error) {
          return toast({
            status: 'error',
            title: 'Error inserting ' + type,
            description: res.error.message,
          });
        }
      }
      await refetch();

      toast({
        status: 'success',
        title: 'Success updating ' + type,
      });
      onClose();
    },
    [
      onClose,
      streamUrl,
      streamLink,
      toast,
      tournament.id,
      refetch,
      place,
      location,
    ]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit tournament info</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
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
            <Button
              isDisabled={
                (!streamUrlEnabled && !streamLink) ||
                (streamUrlEnabled && streamUrl === streamLink)
              }
              onClick={() => handleSubmit('stream')}
            >
              Update stream
            </Button>
          </Stack>
          <Stack>
            <Autocomplete
              defaultValue={place?.formatted_address}
              apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}
              onPlaceSelected={place => setPlace(place)}
              options={{
                fields: [
                  'formatted_address',
                  'utc_offset_minutes',
                  'address_components',
                ],
              }}
            />
            <Button
              isDisabled={
                !place ||
                place?.formatted_address === location?.formatted_address
              }
              onClick={() => handleSubmit('location')}
            >
              Update location
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
