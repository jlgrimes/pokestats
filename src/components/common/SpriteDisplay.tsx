import { Flex, Image } from '@chakra-ui/react';

interface SpriteDisplayProps {
  pokemonNames: string[];
}

export default function SpriteDisplay(props: SpriteDisplayProps) {
  const spritebaseUrl =
    'https://limitlesstcg.s3.us-east-2.amazonaws.com/pokemon/gen8-v3';

  return (
    <Flex gap='4px'>
      {props.pokemonNames.map((name, idx) => (
        <Image
          key={idx}
          src={`${spritebaseUrl}/${name.toLowerCase()}.png`}
          alt={name}
          maxHeight='30px'
          width='auto'
        />
      ))}
    </Flex>
  );
}
