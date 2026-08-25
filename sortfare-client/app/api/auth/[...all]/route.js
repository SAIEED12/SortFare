import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

const handler = toNextJsHandler(auth)

export const GET = handler.GET

export const POST = async (req, ctx) => {
  try {
    return await handler.POST(req, ctx)
  } catch (err) {
    console.error('[auth] POST failed:', err)
    throw err
  }
}
