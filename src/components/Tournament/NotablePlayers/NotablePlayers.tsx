import { Flex } from '@chakra-ui/react';
import NotablePlayersForm from './NotablePlayersForm/NotablePlayersForm';
import NotablePlayersList from './NotablePlayersList/NotablePlayersList';

export default function NotablePlayers({
  tournament,
  allowEdits,
}: {
  tournament: string;
  allowEdits: boolean;
}) {
  return (
    <Flex flexDirection={'column'}>
      {allowEdits && <NotablePlayersForm tournament={tournament} />}
      <NotablePlayersList tournament={tournament} />
    </Flex>
  );
}
