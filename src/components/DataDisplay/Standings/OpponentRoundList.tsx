import {
  Card,
  CardBody,
  Divider,
  Grid,
  GridItem,
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
import { useLiveTournamentResults } from '../../../hooks/tournamentResults';
import { tableHeadingProps } from './props';
import { StandingsRow } from './StandingsRow';

export const OpponentRoundList = ({
  opponents,
  tournament,
  playerName,
  modalOpen,
  handleCloseModal,
}: {
  opponents: { name: string; result: string }[];
  tournament: Tournament;
  playerName: string;
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

  return (
    <Modal isOpen={modalOpen} onClose={handleCloseModal} size='full'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${playerName}'s match history`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingTop={0}>
          <Grid
            gridTemplateColumns={'2rem repeat(3, auto)'}
            alignItems='center'
          >
            <GridItem></GridItem>
            <Text {...tableHeadingProps}>Name</Text>
            <Text {...tableHeadingProps} paddingLeft={1}>
              Record
            </Text>
            <Text {...tableHeadingProps} paddingLeft={2}>
              Deck
            </Text>
            {opponents
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
                      />
                    </Fragment>
                  )
              )}
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
