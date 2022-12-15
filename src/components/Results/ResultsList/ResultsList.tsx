import { Editable, Stack } from '@chakra-ui/react';

export default function ResultsList() {
  // TODO: Replace with React query
  const results = [
    {
      player: 'Jared',
      deck: 'Lugia',
    },
  ];

  return (
    <Stack>
      {results.map(
        ({ player, deck }: { player: string; deck: string }, idx: number) => (
          <Editable key={idx}>
            {player} {deck}
          </Editable>
        )
      )}
    </Stack>
  );
}
