import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { getSession } from 'next-auth/react';

export default function Admin() {
  return (
    <Flex>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input />
      </FormControl>
      <FormControl>
        <FormLabel>Deck</FormLabel>
        <Input />
      </FormControl>
    </Flex>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
