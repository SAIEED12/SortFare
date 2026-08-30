import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

let _auth = null;

export function getAuth() {
  if (!_auth) {
    const client = new MongoClient(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB || "sortfare");
    _auth = betterAuth({
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      },
      database: mongodbAdapter(db, {
        client,
      }),
    });
  }
  return _auth;
}
