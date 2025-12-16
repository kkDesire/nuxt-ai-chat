<script setup lang="ts">
const route = useRoute()

const { data: chats } = useFetch('/api/chats', {
  key: 'chats',
  default: () => [],
})

const items = computed(() => [
  {
    label: 'New chat',
    to: '/',
    icon: 'i-lucide-plus-square',
    active: route.name === 'index',
  },
  ...chats.value.map(chat => ({
    label: chat.title || 'Untitled',
    to: `/chat/${chat.id}`,
    active: route.params.id === chat.id,
  })),
])
</script>

<template>
  <UDropdownMenu :items="items" class="m-2">
    <UButton
      icon="i-lucide-messages-square"
      variant="ghost"
      label="Chats History"
      color="neutral"
      class="w-fit"
    />
  </UDropdownMenu>
</template>
