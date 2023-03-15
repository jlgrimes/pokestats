import { HStack, Tab, TabList, Tabs } from '@chakra-ui/react';

export const RoundTabs = ({
  round,
  setRound,
  maxRound,
}: {
  round: number;
  setRound: (round: number) => void;
  maxRound: number;
}) => {
  return (
    <HStack width='90vw' overflowX={'scroll'} flexDirection='row-reverse'>
      <Tabs
        variant={'solid-rounded'}
        colorScheme='blue'
        index={round - 1}
        onChange={idx => setRound(idx + 1)}
      >
        <TabList>
          {[...Array(maxRound)].map((_, idx) => (
            <Tab
              key={`round-tab-${idx}`}
            >
              {idx + 1}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </HStack>
  );
};
