import { Flex } from '@chakra-ui/react';
import { getSession } from 'next-auth/react';
import PlayerInputForm from '../src/components/Admin/PlayerInputForm';

export default function Admin() {
  return (
    <Flex flexDirection={'column'}>
      <PlayerInputForm />
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
