import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local')
}

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = globalThis

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = globalWithMongo._mongoClient.connect()
  }
  client = globalWithMongo._mongoClient
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

const db = client.db()

export default db
export { client, clientPromise }
