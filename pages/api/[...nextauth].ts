import NextAuth, { Session, TokenSet } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import { fetchServerSideTwitterProfile } from './get-twitter-profile';
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
      const id = token.sub as string;

      const profile = await fetchServerSideTwitterProfile({ id });
      // Send properties to the client, like an access_token and user id from a provider.
      if (session.user) {
        session.user = {
          id: id,
          name: profile?.name as string,
          username: profile?.username as string,
          profile_image_url: profile?.profile_image_url as string
        };
      }

      return session;
    },
  },
};
export default NextAuth(authOptions);
