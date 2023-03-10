import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Spinner,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';

export interface TournamentSelectorProps {
  tournaments: Tournament[] | undefined;
  currentTournament: Tournament | undefined;
  setTournament: (tournament: Tournament) => void;
}

export const TournamentSelector = (props: TournamentSelectorProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Menu onClose={onClose} isOpen={isOpen} isLazy>
      <Box>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          onClick={onOpen}
        >
          {props.tournaments && props.currentTournament ? (
            props.currentTournament.name
          ) : (
            <Spinner />
          )}
        </MenuButton>
      </Box>
      <MenuList overflowY={'scroll'} height='50vh' width='100vw'>
        {props.tournaments
          ?.slice()
          ?.reverse()
          .map(tournament => (
            <Box
              paddingX={4}
              paddingY={1}
              onClick={() => {
                onClose();
                props.setTournament(tournament);
              }}
              key={tournament.id}
            >
              {tournament.name}
            </Box>
          ))}
      </MenuList>
    </Menu>
  );
};
