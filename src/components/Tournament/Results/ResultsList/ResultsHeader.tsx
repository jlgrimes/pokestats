import { Th, Thead, Tr } from '@chakra-ui/react';

export const ResultsHeader = ({
  isProfileView,
}: {
  isProfileView: boolean;
}) => {
  return (
    <Thead>
      <Tr>
        {isProfileView && (
          <Th padding={0} paddingLeft={2}>
            Tournament
          </Th>
        )}
        {isProfileView ? (
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
