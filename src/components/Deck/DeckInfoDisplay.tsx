import {
  Box,
  Grid,
  HStack,
  IconButton,
  Stack,
  StackItem,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { memo, useCallback } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { Standing, Tournament } from '../../../types/tournament';
import { StandingsInfoMenu } from '../DataDisplay/Standings/StandingsInfoMenu';
import DeckInput from './DeckInput/DeckInput';
import { UploadListButton } from './ImageListViewer/UploadListButton';
import { ListViewerOpenButton } from './ListViewer/ListViewerOpenButton';

export const DeckInfoDisplay = memo(
  ({
    player,
    tournament,
    enableEdits,
    shouldShowAsText,
    disableList,
    shouldHideDeck,
    shouldHideVerifiedIcon,
    shouldHideOpponentView,
    onUnpinPlayer,
    shouldHideMenu,
    shouldDisableDeckExtras,
  }: {
    player: Standing;
    tournament: Tournament;
    enableEdits: boolean;
    shouldShowAsText?: boolean;
    disableList?: boolean;
    shouldHideDeck?: boolean;
    shouldHideVerifiedIcon?: boolean;
    shouldHideOpponentView?: boolean;
    onUnpinPlayer?: () => void;
    shouldHideMenu?: boolean;
    shouldDisableDeckExtras?: boolean;
  }) => {
    const archetypeModal = useDisclosure();
    const session = useSession();

    const userIsLoggedInUser = player.name === session.data?.user?.name;
    const shouldShowList = player?.deck?.list || player.deck?.listImagePath && !disableList;
    const shouldShowSmallEditIcon = enableEdits && player.deck?.id;

    const ifShouldHideDeck = useCallback(() => {
      if (tournament.tournamentStatus === 'finished') return false;

      // If you are the player, or the player has played against you, show the deck
      if (
        session.status === 'authenticated' &&
        (session.data?.user?.name === player.name ||
          player.rounds?.some(
            round => round.opponent?.name === session.data?.user?.name
          ))
      ) {
        return false;
      }

      return shouldHideDeck;
    }, [
      player,
      session.data?.user?.name,
      session.status,
      shouldHideDeck,
      tournament.tournamentStatus,
    ]);

    return (
      <Grid
        gridTemplateColumns={
          userIsLoggedInUser
            ? 'auto 15px 50px'
            : shouldDisableDeckExtras &&
              !shouldShowList &&
              !shouldShowSmallEditIcon
            ? 'auto'
            : shouldShowAsText
            ? 'auto 25px'
            : '80px 25px'
        }
        columnGap={2}
        alignItems='center'
      >
        <DeckInput
          tournament={tournament}
          playerName={player.name}
          deck={player.deck ?? undefined}
          archetypeModal={archetypeModal}
          shouldShowAsText={shouldShowAsText}
          shouldHideDeck={ifShouldHideDeck()}
          shouldHideVerifiedIcon={shouldHideVerifiedIcon}
          shouldEnableEdits={enableEdits}
        />
        {shouldShowSmallEditIcon && !player.deck?.list && (
          <IconButton
            icon={<FaRegEdit />}
            aria-label='edit'
            variant={'unstyled'}
            size='sm'
            color='pink.500'
            minWidth={0}
            onClick={e => {
              e.stopPropagation();
              archetypeModal.onOpen();
            }}
          />
        )}

        {shouldShowList ? (
          <ListViewerOpenButton result={player} tournament={tournament} />
        ) : userIsLoggedInUser && tournament.tournamentStatus === 'finished' ? (
          <UploadListButton
            placing={player.placing}
            tournamentId={tournament.id}
          />
        ) : (
          <Box />
        )}

        {/* {!shouldHideMenu && (
          <StandingsInfoMenu
            result={player}
            tournament={tournament}
            onEditOpen={archetypeModal.onOpen}
            enableEdits={enableEdits}
            shouldHideOpponentView={shouldHideOpponentView}
            onUnpinPlayer={onUnpinPlayer}
          />
        )} */}

        {/* {player?.deck?.list && !disableList && (
          <ListViewerOpenButton result={player} tournament={tournament} />
        )}
         */}
      </Grid>
    );
  }
);

DeckInfoDisplay.displayName = 'DeckInfoDisplay';
