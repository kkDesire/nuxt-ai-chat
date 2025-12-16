<script lang="ts" setup>
const model = defineModel<string>({ required: true })

const { models } = useModels()

const selectedModel = computed(() =>
  models.find(m => m.value === model.value),
)
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="models"
    :icon="selectedModel?.icon"
    variant="ghost"
    value-key="value"
  />
</template>

<style>

</style>
