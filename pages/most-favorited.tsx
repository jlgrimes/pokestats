import { HStack, Stack, Text } from '@chakra-ui/react';
import { CommonCard } from '../src/components/common/CommonCard';
import { useUserIsAdmin } from '../src/hooks/administrators';
import { useMostPopularPinned } from '../src/hooks/pinnedPlayers';

export default function Page() {
  const mostPopularPined = useMostPopularPinned();
  const { data: userIsAdmin } = useUserIsAdmin();

  return (
    <Stack width='100%' alignItems={'center'}>
      <CommonCard header='most favorited'>
        <Stack>
          {mostPopularPined
            ?.slice(0, userIsAdmin ? -1 : 8)
            .map(([player, count]) => (
              <HStack key={Math.random()}>
                <Text>{player}</Text>
                {userIsAdmin && <Text>{count}</Text>}
              </HStack>
            ))}
        </Stack>
      </CommonCard>
    </Stack>
  );
}
