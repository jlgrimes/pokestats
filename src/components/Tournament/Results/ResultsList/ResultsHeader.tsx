import { Th, Thead, Tr } from '@chakra-ui/react';

export const ResultsHeader = ({
  view,
}: {
  view: 'profile' | 'standings' | 'matchups';
}) => {
  return (
    <Thead>
      <Tr>
        {view === 'profile' && (
          <Th padding={0} paddingLeft={2}>
            Tournament
          </Th>
        )}
        {view === 'matchups' && <Th></Th>}
        {view === 'standings' && <Th></Th>}
        {view === 'profile' ? (
          <Th padding={0}>Seed</Th>
        ) : (
          <Th padding={0} paddingLeft={2}>
            Name
          </Th>
        )}
        <Th padding={0}>Record</Th>
        <Th padding={0} paddingLeft={2}>
          Deck
        </Th>
      </Tr>
    </Thead>
  );
};
