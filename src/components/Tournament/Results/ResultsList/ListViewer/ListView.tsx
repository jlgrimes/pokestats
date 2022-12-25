import { Heading, Stack, Text } from "@chakra-ui/react"

export const ListView = ({ deckList }: { deckList: Record<string, any>}) => {
  return (
    <Stack direction={'row'}>
    {['Pokemon', 'Trainer', 'Energy'].map((superclass, idx) => (
      <Stack key={idx}>
        <Heading size='sm'>{superclass}</Heading>
        {deckList[superclass.toLowerCase()].map(
          (card: Record<string, any>, textIdx: number) => (
            <Text
              key={textIdx}
            >{`${card.count} ${card.name}`}</Text>
          )
        )}
      </Stack>
    ))}
  </Stack>
  )
}