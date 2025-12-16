import type { UIMessage } from 'ai'
import { defineEventHandler, readValidatedBody } from 'h3'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { message } = await readValidatedBody(event, z.object({
    message: z.custom<UIMessage>(),
  }).parse)

  const [chat] = await db.insert(schema.chats).values({}).returning()

  await db.insert(schema.messages).values({
    chatId: chat.id,
    role: 'user',
    parts: message.parts,
  })

  return chat
})
