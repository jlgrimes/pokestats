import {
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
  StackItem,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  MatchResult,
  Standing,
  Tournament,
} from '../../../../../types/tournament';
import { useUserIsAdmin } from '../../../../hooks/administrators';
import { useUserMatchesLoggedInUser } from '../../../../hooks/user';
import { RoundsList } from '../../Rounds/RoundsList';
import { useSmartPlayerProfiles } from '../../../../hooks/user';
import { ordinalSuffixOf } from '../../../../lib/strings';
import { DeckInfoDisplay } from '../../../Deck/DeckInfoDisplay';
import { Username } from '../../../Profile/Username';
import { FollowButton } from '../../../Social/FollowButton';
import { Record } from '../../../Tournament/Results/ResultsList/Record';
import { RecordIcon } from '../../../Tournament/Results/ResultsList/RecordIcon';
import { useStandings } from '../../../../hooks/newStandings';
import { cropPlayerName } from '../../../../lib/fetch/fetchLiveResults';
import { formatRecord } from '../../../Tournament/Results/ResultsList/helpers';

export const OpponentRoundListContent = ({
  tournament,
  player,
}: {
  tournament: Tournament;
  player: Standing;
}) => {
  // We set the load - allRoundData flag to true because this component will only
  // get rendered if opponent round data is loaded. So we can just tap into that
  // without triggering a long load time for refetching the tournament.
  const { data: liveResults } = useStandings({ tournament, ageDivision: player.age_division });
  const { data: userIsAdmin } = useUserIsAdmin();
  const userMatchesLoggedInUser = useUserMatchesLoggedInUser(player.name);

  const { data } = useSmartPlayerProfiles({ name: player.name });
  const playerProfile = data?.at(0);

  const opponents: { name: string; result: MatchResult }[] | undefined =
    player.rounds;

  const rounds = opponents?.map(({ name, result }) => {
    const standing = liveResults?.find(
      standing => standing.name === cropPlayerName(name)
    );
    return {
      opponent: standing,
      name,
      result,
    };
  });

  return (
    <>
      <ModalHeader padding={'0.5rem 2rem'}>
        <HStack>
          <Grid gridTemplateColumns={'2fr 1fr'} pr={4}>
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
              <Text fontSize='lg'>{ordinalSuffixOf(player.placing) + ' ' + formatRecord(player.record)}</Text>
              <DeckInfoDisplay
                tournament={tournament}
                player={player}
                enableEdits={false}
                disableList
                shouldDisableDeckExtras
              />
            </Stack>
          </Grid>
        </HStack>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody paddingTop={0} paddingX={0}>
        {rounds && (
          <RoundsList
            player={{
              ...player,
              rounds,
            }}
            tournament={tournament}
            shouldDisableOpponentModal
            canEditDecks={userMatchesLoggedInUser}
            userIsAdmin={userIsAdmin}
          />
        )}
      </ModalBody>
    </>
  )
};
