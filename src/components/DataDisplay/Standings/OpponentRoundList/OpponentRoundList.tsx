import {
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useIsMobile } from '../../../../hooks/device';
import {
  usePlayerIsMeOrMyOpponent,
  usePlayerLiveResults,
} from '../../../../hooks/tournamentResults';
import { useSmartPlayerProfiles } from '../../../../hooks/user';
import { ordinalSuffixOf } from '../../../../lib/strings';
import { DeckInfoDisplay } from '../../../Deck/DeckInfoDisplay';
import { Username } from '../../../Profile/Username';
import { FollowButton } from '../../../Social/FollowButton';
import { Record } from '../../../Tournament/Results/ResultsList/Record';
import { RecordIcon } from '../../../Tournament/Results/ResultsList/RecordIcon';
import { OpponentRoundListContent } from './OpponentRoundListContent';
interface OpponentRoundListProps {
  tournament: Tournament;
  player: Standing;
  modalOpen: boolean;
  handleCloseModal: () => void;
}

export const OpponentRoundList = (props: OpponentRoundListProps) => {
  const { tournament, player, modalOpen, handleCloseModal } = props;

  const isMobile = useIsMobile();
  const { shouldHideDecks } = usePlayerLiveResults(tournament.id, player.name);
  const { data } = useSmartPlayerProfiles({ name: player.name });
  const playerProfile = data?.at(0);

  const isMyOpponent = usePlayerIsMeOrMyOpponent(props.player);

  return (
    <Modal isOpen={modalOpen} onClose={handleCloseModal} size='md'>
      <ModalOverlay />
      <ModalContent margin={isMobile ? 'auto' : 0}>
        <ModalHeader padding={'0.5rem 2rem'}>
          <HStack>
            <Grid gridTemplateColumns={'2.5fr 1fr'} pr={4}>
              <Stack spacing={0}>
                <Flex wrap='wrap' alignItems={'center'}>
                  <Text mr='2'>{player.name}</Text>
                </Flex>
                <HStack>
                  {playerProfile?.username && (
                    <Username small isLink>
                      {playerProfile?.username}
                    </Username>
                  )}
                  <FollowButton playerName={player.name} />
                </HStack>
              </Stack>
              <Stack spacing={0}>
                <HStack alignItems='center'>
                  <HStack spacing={0}>
                    <RecordIcon standing={player} tournament={tournament} />
                    <Text fontSize='lg'>{ordinalSuffixOf(player.placing)}</Text>
                  </HStack>
                  <Record standing={player} normal />
                </HStack>
                <DeckInfoDisplay
                  tournament={tournament}
                  player={player}
                  enableEdits={false}
                  disableList
                  // Since we're pulling from post-tournament
                  shouldHideDeck={shouldHideDecks}
                  shouldDisableDeckExtras
                  isPlayerMeOrMyOpponent={isMyOpponent}
                />
              </Stack>
            </Grid>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingTop={0} paddingX={0}>
          {modalOpen && (
            <OpponentRoundListContent tournament={tournament} player={player} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
