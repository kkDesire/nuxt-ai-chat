import type { UIMessage } from 'ai'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText,
} from 'ai'
import { eq } from 'drizzle-orm'
import { createError, defineEventHandler, getValidatedRouterParams, readValidatedBody } from 'h3'
import { db, schema } from 'hub:db'

import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string(),
  }).parse)

  const { model, messages } = await readValidatedBody(event, z.object({
    model: z.string().default('openai/gpt-4o-mini'),
    messages: z.array(z.custom<UIMessage>()),
  }).parse)

  // Fetch the chat from the database
  const chat = await db.query.chats.findFirst({
    where: (chat: any, { eq }: any) => eq(chat.id, id as string),
  })

  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  if (!chat.title) {
    const { text: title } = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `Generate a short title (max 30 characters) based on the user's message. No quotes or punctuation.`,
      prompt: JSON.stringify(messages[0]),
    })

    await db.update(schema.chats).set({ title }).where(eq(schema.chats.id, id))
  }

  // Save the user message if it's a follow-up
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && messages.length > 1) {
    await db.insert(schema.messages).values({
      chatId: id,
      role: 'user',
      parts: lastMessage.parts,
    })
  }

  // Create the streaming response
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const result = streamText({
        model,
        system: `You are a helpful AI assistant. Be concise and friendly.`,
        messages: convertToModelMessages(messages),
      })

      // Notify the client that a title was generated
      if (!chat.title) {
        writer.write({
          type: 'data-chat-title',
          data: { message: 'Title generated' },
          transient: true,
        })
      }
      writer.merge(result.toUIMessageStream())
    },
    onFinish: async ({ messages }) => {
      // Save the assistant's response to the database
      await db.insert(schema.messages).values(messages.map(message => ({
        chatId: chat.id,
        role: message.role as 'user' | 'assistant',
        parts: message.parts,
      })))
    },
  })

  return createUIMessageStreamResponse({ stream })
})
