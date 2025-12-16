<script lang="ts" setup>
import { Chat } from '@ai-sdk/vue'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import { DefaultChatTransport } from 'ai'

const route = useRoute()
const toast = useToast()

// Fetch existing chat data
const { data: chatData } = await useFetch(`/api/chats/${route.params.id}`)

if (!chatData.value) {
  throw createError({ statusCode: 404, statusMessage: 'Chat not found', fatal: true })
}

const input = ref('')

const chat = new Chat({
  id: chatData.value.id,
  messages: chatData.value.messages,
  transport: new DefaultChatTransport({
    api: `/api/chats/${chatData.value.id}`,
  }),
  onData(dataPart) {
    // Refresh the chat list when a title is generated
    if (dataPart.type === 'data-chat-title') {
      refreshNuxtData('chats')
    }
  },
  onError(error) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'error',
    })
  },
})

function handleSubmit(e: Event) {
  e.preventDefault()
  if (input.value.trim()) {
    chat.sendMessage({ text: input.value })
    input.value = ''
  }
}

// Auto-generate response for first message
onMounted(() => {
  if (chatData.value?.messages.length === 1) {
    chat.regenerate()
  }
})
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0' }">
    <template #body>
      <UContainer class="min-h-dvh flex flex-col py-4 sm:py-6">
        <UChatMessages
          :messages="chat.messages"
          :status="chat.status"
          should-auto-scroll
          class="flex-1"
        >
          <template #content="{ message }">
            <MDC
              :value="getTextFromMessage(message)"
              :cache-key="message.id"
              class="*:first:mt-0 *:last:mb-0"
            />
          </template>
        </UChatMessages>

        <UChatPrompt
          v-model="input"
          :error="chat.error"
          variant="subtle"
          class="sticky bottom-0"
          @submit="handleSubmit"
        >
          <UChatPromptSubmit
            :status="chat.status"
            color="neutral"
            @stop="chat.stop()"
            @reload="chat.regenerate()"
          />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>

<style>

</style>
