import NextAuth, { Session, TokenSet } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import { fetchServerSideTwitterProfile } from '../get-twitter-profile';
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.NEXTAUTH_SECRET ?? '',
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID ?? '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET ?? '',
      version: '2.0', // opt-in to Twitter OAuth 2.0
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token }: { session: Session, token: TokenSet}) {
      return {
        ...session,
        user: {
          ...session.user,
          email: session.user?.email?.toLowerCase()
        }
      };
    },
  },
};
export default NextAuth(authOptions);
