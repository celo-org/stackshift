// import NextAuth from 'next-auth/react';
// import TwitterProvider from "next-auth/providers/twitter";

// export default NextAuth ({
//   providers: [
//     TwitterProvider({
//       clientId: process.env.TWITTER_ID,
//       clientSecret: process.env.TWITTER_SECRET!
//     })
//   ],
//   callbacks: {
//     async jwt({ token, profile, account }) {
//       if (profile) {
//         token.username = profile.data.username;
//       }
//       return token;
//     }, 
//     async session({ session, token, user }) {
//       if (token.username) {
//         session.username = token.username;
//       }
//       return session
//     }
//   }
// })

import { Client, auth } from "twitter-api-sdk";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

const authClient = new auth.OAuth2User({
    client_id: process.env.TWITTER_ID as string,
    client_secret: process.env.TWITTER_SECRET as string,
    callback: "http://127.0.0.1:3000/callback",
    scopes: ["tweet.read", "users.read"],
});

const STATE = "my-state";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const authUrl = authClient.generateAuthURL({
        state: STATE,
        code_challenge_method: "s256",
    });

    return res.status(200).json({
        url: authUrl,
    });
}