import {
  Button,
  Grid,
  HStack,
  Menu,
  MenuItemOption,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { Tournament } from '../../../../types/tournament';
import { useTournamentMetadata } from '../../../hooks/tournamentMetadata';

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
  const [streamUrlEnabled, setStreamUrlEnabled] = useState(
    !!streamInfo?.at(0)?.data
  );
  const [streamUrl, setStreamUrl] = useState(streamInfo?.at(0)?.data);

  const handleSubmit = useCallback(() => {}, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Edit tournament info</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Grid gridTemplateColumns={'1rem 1rem'}>
          <HStack>
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
        <Button disabled={streamUrl} onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};
