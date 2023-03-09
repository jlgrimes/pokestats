import {
  Box,
  Grid,
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

    return (
      <Grid
        gridTemplateColumns={shouldShowAsText ? 'auto 1fr 1fr' : '85px 1fr 1fr'}
        alignItems='center'
      >
        <Box
          position={'relative'}
          {...(enableEdits
            ? {
                outline: '2px solid',
                outlineColor: player.deck?.id ? 'pink.100' : 'pink.500',
                rounded: 'md',
                onClick: archetypeModal.onOpen,
              }
            : {})}
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
          {enableEdits && player.deck?.id && (
            <IconButton
              zIndex={5}
              position={'absolute'}
              top={-3}
              right={-2}
              maxWidth={'2'}
              icon={<FaRegEdit />}
              aria-label='edit'
              variant={'ghost'}
              width={'100%'}
              size='sm'
              color='pink.300'
              paddingRight={0}
            />
          )}
        </Box>

        {player?.deck?.list && !disableList && (
          <ListViewerOpenButton result={player} tournament={tournament} />
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
