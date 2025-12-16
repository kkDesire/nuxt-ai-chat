export function useModels() {
  const models = [
    { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', icon: 'i-simple-icons-openai' },
    { value: 'anthropic/claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku', icon: 'i-simple-icons-anthropic' },
    { value: 'google/gemini-2.0-flash', label: 'Gemini 2.0 Flash', icon: 'i-simple-icons-google' },
  ]

  const model = useCookie<string>('ai-model', {
    default: () => 'openai/gpt-4o-mini',
  })

  return {
    models,
    model,
  }
}
