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
      // version: "2.0",

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
      async jwt({ token, profile, account }) {
          if (profile) {
              token.username = profile.data.username;
          }
          return token;
      },
      async session({ session, token, user }) {
          console.log("Session", token.username);
          if (token.username) {
              session.username = token.username;
          }
          return session;
      },
          
     debug: true,
    logger: {
        error(code, metadata) {
            console.error(code, metadata);
        },
    },
}

export default NextAuth(authOptions)