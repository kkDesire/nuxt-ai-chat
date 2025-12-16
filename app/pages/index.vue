<script lang="ts" setup>
const input = ref('')
const loading = ref(false)

async function createChat() {
  if (!input.value.trim())
    return

  loading.value = true

  // Create a new chat on the server
  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: {
      message: {
        role: 'user',
        parts: [{ type: 'text', text: input.value }],
      },
    },
  })

  // Navigate to the chat page
  navigateTo(`/chat/${chat?.id}`)
}
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0' }">
    <template #body>
      <UContainer class="min-h-dvh flex flex-col justify-center gap-6 py-8">
        <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
          How can I help you today?
        </h1>
        <UChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          variant="subtle"
          placeholder="Ask me anything..."
          @submit="createChat"
        >
          <UChatPromptSubmit color="neutral" />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>

<style>

</style>
