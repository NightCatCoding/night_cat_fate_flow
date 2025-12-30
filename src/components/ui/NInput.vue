<script setup lang="ts">
import {computed} from 'vue'

defineOptions({name: 'NInput'})

interface Props {
  modelValue: string | number
  type?: 'text' | 'number' | 'email' | 'password' | 'search'
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  min?: number
  max?: number
  mono?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  size: 'md',
  error: false,
  mono: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'enter': []
  'blur': []
}>()

// Static base classes as a single string for better performance
const BASE_CLASSES = `
  w-full transition-all duration-300 ease-out
  bg-night-surface/60 backdrop-blur-sm
  border-2 border-transparent
  rounded-2xl
  text-txt-primary placeholder-txt-muted/60
  focus:outline-none focus:bg-night-surface
  focus:border-cat-eye/40 focus:shadow-glow-sm
  disabled:opacity-40 disabled:cursor-not-allowed
  hover:bg-night-surface/80
`.trim().replace(/\s+/g, ' ')

// Size class mappings
const SIZE_CLASSES: Record<string, string> = {
  sm: 'px-4 py-2.5 text-sm',
  md: 'px-5 py-3.5 text-base',
  lg: 'px-6 py-4.5 text-lg',
}

const sizeClasses = computed(() => SIZE_CLASSES[props.size])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('enter')
  }
}
</script>

<template>
  <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      :class="[
        BASE_CLASSES,
        sizeClasses,
        error ? 'border-accent-danger/50 focus:border-accent-danger' : '',
        mono ? 'font-mono tracking-wide' : 'font-medium',
      ]"
      @input="handleInput"
      @keydown="handleKeydown"
      @blur="emit('blur')"
  />
</template>
