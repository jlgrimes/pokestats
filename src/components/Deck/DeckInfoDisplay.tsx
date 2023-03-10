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
import { memo } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { Standing, Tournament } from '../../../types/tournament';
import { StandingsInfoMenu } from '../DataDisplay/Standings/StandingsInfoMenu';
import DeckInput from './DeckInput/DeckInput';
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
  }) => {
    const archetypeModal = useDisclosure();
    const session = useSession();

    const shouldShowList = player?.deck?.list && !disableList;
    const shouldShowSmallEditIcon = enableEdits && player.deck?.id;

    return (
      <Grid
        gridTemplateColumns={shouldShowAsText ? 'auto 25px' : '80px 25px'}
        columnGap={2}
        alignItems='center'
      >
        <DeckInput
          tournamentId={tournament.id}
          playerName={player.name}
          deck={player.deck ?? undefined}
          archetypeModal={archetypeModal}
          shouldShowAsText={shouldShowAsText}
          shouldHideDeck={
            shouldHideDeck &&
            session.data?.user?.email !== player.deck?.user_who_submitted
          }
          shouldHideVerifiedIcon={shouldHideVerifiedIcon}
          shouldEnableEdits={enableEdits}
        />
        {shouldShowSmallEditIcon && !shouldShowList && (
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
