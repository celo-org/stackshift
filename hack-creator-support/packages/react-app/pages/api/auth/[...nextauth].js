import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

// export default NextAuth({
//   providers: [
//    TwitterProvider({
//       clientId:  process.env.TWITTER_CONSUMER_KEY,
//       clientSecret: process.env.TWITTER_CONSUMER_SECRET,
//     })
//   ],
//   })

  export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CONSUMER_KEY,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET,
    }),
    // ...add more providers here
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
           const isAllowedToSignIn = true
          if (isAllowedToSignIn) {
            return true
          } else {
            // Return false to display a default error message
            return false
            // Or you can return a URL to redirect to:
            // return '/unauthorized'
          }
        }
      },
      async redirect({ url, baseUrl }) {
         // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
      },
 session: async ({ session, token }) => {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      session.user.id = token.id
      
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  session: {
    strategy: 'jwt',
  },
}

export default NextAuth(authOptions)