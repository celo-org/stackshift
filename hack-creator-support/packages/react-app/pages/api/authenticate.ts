import { Client, auth } from "twitter-api-sdk";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

const authClient = new auth.OAuth2User({
    client_id: process.env.CLIENT_ID as string,
    client_secret: process.env.CLIENT_SECRET as string,
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