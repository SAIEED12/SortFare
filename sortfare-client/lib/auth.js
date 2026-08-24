import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { nextCookies } from 'better-auth/next-js'
import clientPromise from './mongodb'

const db = clientPromise.then((client) => client.db())

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: clientPromise,
  }),
  emailAndPassword: {
    enabled: true,
  },
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),
  plugins: [nextCookies()],
  advanced: {
    database: {
      joins: true,
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean),
})
