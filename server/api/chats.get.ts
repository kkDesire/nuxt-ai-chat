import { desc } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { db, schema } from 'hub:db'

export default defineEventHandler(async () => {
  return await db.query.chats.findMany({
    orderBy: () => desc(schema.chats.createdAt),
  })
})
