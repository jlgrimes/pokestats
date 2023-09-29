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
import { memo, useCallback } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { Standing, Tournament } from '../../../types/tournament';
import { useUserMatchesLoggedInUser } from '../../hooks/user';
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
    isPlayerMeOrMyOpponent,
  }: {
    player: Standing;
    tournament: Tournament;
    enableEdits: boolean;
    isPlayerMeOrMyOpponent: boolean;
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
    const userIsLoggedInUser = useUserMatchesLoggedInUser(player.name);

    const shouldShowList =
      player?.decklist;
    const shouldShowSmallEditIcon = enableEdits && player.deck_archetype;

    const ifShouldHideDeck = useCallback(() => {
      if (tournament.tournamentStatus === 'finished') return false;

      return !isPlayerMeOrMyOpponent && shouldHideDeck;
    }, [shouldHideDeck, tournament.tournamentStatus, isPlayerMeOrMyOpponent]);

    const ifShouldBlurSpecificAArchetype = useCallback(() => {
      if (tournament.tournamentStatus === 'finished') return false;
      if (tournament.topCutStatus) return false;

      return !isPlayerMeOrMyOpponent;
    }, [
      tournament.tournamentStatus,
      isPlayerMeOrMyOpponent,
      tournament.topCutStatus,
    ]);

    const shouldShowEditButton = shouldShowSmallEditIcon && !player.decklist;

    return (
      <Grid
        gridTemplateColumns={
          userIsLoggedInUser && shouldShowEditButton
            ? `auto 15px 50px`
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
          deck={player.deck_archetype ?? undefined}
          archetypeModal={archetypeModal}
          shouldShowAsText={shouldShowAsText}
          shouldHideDeck={ifShouldHideDeck()}
          shouldHideSpecificArchetype={ifShouldBlurSpecificAArchetype()}
          shouldHideVerifiedIcon={shouldHideVerifiedIcon}
          shouldEnableEdits={enableEdits}
        />
        {shouldShowEditButton && (
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
