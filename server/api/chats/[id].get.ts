import { asc, eq } from 'drizzle-orm'
import { createError, defineEventHandler, getValidatedRouterParams } from 'h3'
import { db, schema } from 'hub:db'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string(),
  }).parse)

  const chat = await db.query.chats.findFirst({
    where: (eq(schema.chats.id, id)),
    with: {
      messages: {
        orderBy: () => asc(schema.messages.createdAt),
      },
    },
  })

  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  return chat
})
