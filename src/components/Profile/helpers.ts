import { Session } from 'next-auth';

export const getFirstName = (session: Session | null) =>
  session?.user?.name?.split(' ')?.[0];
