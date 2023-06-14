import NextAuth from 'next-auth';
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth ({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET
    })
  ],
  callbacks: {
    async jwt({ token, profile, account }) {
      if (profile) {
        token.username = profile.name;
      }
      return token;
    }, 
    async session({ session, token, user }) {
      if (token) {
        session.user = token.username;
      }
      return session
    }
  }
})

// import { Client, auth } from "twitter-api-sdk";
// import dotenv from "dotenv";
// import { NextApiRequest, NextApiResponse } from "next";

// dotenv.config();

// const authClient = new auth.OAuth2User({
//     client_id: "hj7clmGkCClTTnkV3gzRjBfrgGMGQqaNEpiEFrJOcIoWu",
//     client_secret: "HHqoCsPlb24LoD1CL9aMyn4W4HkCOzcagL2cOiQgH2VEOXoo2x",
//     callback: "http://127.0.0.1:3000/api/auth/callback/twitter",
//     scopes: ["tweet.read", "users.read"],
// });

// const STATE = "my-state";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//     const authUrl = authClient.generateAuthURL({
//         state: STATE,
//         code_challenge_method: "s256",
//     });

//     return res.status(200).json({
//         url: authUrl,
//     });
// }