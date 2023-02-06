import {
  Card,
  CardBody,
  Divider,
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
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Fragment, useEffect, useState } from 'react';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { useIsMobile } from '../../../hooks/device';
import { useLiveTournamentResults } from '../../../hooks/tournamentResults';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { Record } from '../../Tournament/Results/ResultsList/Record';
import { RecordIcon } from '../../Tournament/Results/ResultsList/RecordIcon';
import { tableHeadingProps } from './props';
import { StandingsRow } from './StandingsRow';

export const OpponentRoundList = ({
  tournament,
  player,
  modalOpen,
  handleCloseModal,
}: {
  tournament: Tournament;
  player: Standing;
  modalOpen: boolean;
  handleCloseModal: () => void;
}) => {
  // We set the load - allRoundData flag to true because this component will only
  // get rendered if opponent round data is loaded. So we can just tap into that
  // without triggering a long load time for refetching the tournament.
  const { data: liveResults } = useLiveTournamentResults(tournament.id, {
    load: { allRoundData: true },
  });
  const { data: userIsAdmin } = useUserIsAdmin();
  const isMobile = useIsMobile();

  const opponents: { name: string; result: string }[] | undefined =
    player.rounds;

  return (
    <Modal isOpen={modalOpen} onClose={handleCloseModal} size='md'>
      <ModalOverlay />
      <ModalContent margin={isMobile ? 'auto' : 0}>
        <ModalHeader padding={'0.5rem 2rem'}>
          <Stack direction='row' alignItems={'center'}>
            <RecordIcon standing={player} tournament={tournament} />
            <HStack paddingRight={'8px'} alignItems='baseline'>
              <Text>{player.name}</Text>
              <Record standing={player} />
            </HStack>
            <DeckInfoDisplay
              tournament={tournament}
              player={player}
              enableEdits={false}
              disableList
              shouldHideDeck={liveResults?.shouldHideDecks}
            />
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingTop={0} paddingX={0}>
          <Stack spacing={0.5}>
            {opponents &&
              opponents
                .slice(0)
                .reverse()
                .map(({ name, result }) => ({
                  standing: liveResults?.data.find(
                    standing => standing.name === name
                  ),
                  name,
                  result,
                }))
                .map(
                  ({ standing, name, result }, idx) =>
                    standing && (
                      <Fragment key={idx}>
                        <Divider gridColumn='1/-1' />
                        <StandingsRow
                          result={standing}
                          tournament={tournament}
                          canEditDecks={userIsAdmin}
                          opponentRoundNumber={opponents.length - idx}
                          opponentResult={result}
                          shouldHideDeck={liveResults?.shouldHideDecks}
                        />
                      </Fragment>
                    )
                )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
