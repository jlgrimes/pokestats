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
import { getShouldHideDecks } from '../../hooks/tournaments';

export const DeckInfoDisplay = memo(
  ({
    player,
    tournament,
    enableEdits,
    disableList,
    shouldHideVerifiedIcon,
    shouldHideOpponentView,
    onUnpinPlayer,
    shouldHideMenu,
    shouldDisableDeckExtras,
    isMe
  }: {
    player: Standing;
    tournament: Tournament;
    enableEdits: boolean;
    disableList?: boolean;
    shouldHideVerifiedIcon?: boolean;
    shouldHideOpponentView?: boolean;
    onUnpinPlayer?: () => void;
    shouldHideMenu?: boolean;
    shouldDisableDeckExtras?: boolean;
    isMe?: boolean;
  }) => {
    const archetypeModal = useDisclosure();
    const userIsLoggedInUser = useUserMatchesLoggedInUser(player.name);

    const shouldShowList =
      player?.decklist && !disableList;
    const shouldShowSmallEditIcon = enableEdits && player.deck_archetype;

    const ifShouldHideDeck = useCallback(() => {
      if (tournament.tournamentStatus === 'finished') return false;

      return getShouldHideDecks(tournament, player.age_division);
    }, [player.age_division, tournament]);

    const ifShouldBlurSpecificAArchetype = useCallback(() => {
      if (tournament.tournamentStatus === 'finished') return false;
      if (tournament.topCutStatus) return false;
      if (userIsLoggedInUser) return false;

      return true;
    }, [
      tournament.tournamentStatus,
      tournament.topCutStatus,
    ]);

    const shouldShowEditButton = shouldShowSmallEditIcon && !player.decklist;

    return (
      <Grid
        columnGap={2}
        alignItems='center'
        position={'relative'}
      >
        <DeckInput
          standing={player}
          tournament={tournament}
          archetypeModal={archetypeModal}
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
            color='gray.500'
            minWidth={0}
            onClick={e => {
              e.stopPropagation();
              archetypeModal.onOpen();
            }}
            position={'absolute'}
            right='-2'
          />
        )}

        {/* {shouldShowList ? (
          <ListViewerOpenButton result={player} tournament={tournament} />
        ) : userIsLoggedInUser && tournament.tournamentStatus === 'finished' ? (
          <UploadListButton
            placing={player.placing}
            tournamentId={tournament.id}
          />
        ) : (
          <></>
        )} */}

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
