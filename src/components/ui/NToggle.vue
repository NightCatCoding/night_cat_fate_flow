<script setup lang="ts">
/**
 * NToggle - 開關切換組件
 * 用於布爾值設置的切換控制
 */
import {computed} from 'vue'

interface Props {
  modelValue: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  activeColor?: 'primary' | 'warm' | 'success' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
  activeColor: 'primary',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Size configurations
const SIZE_CONFIG: Record<string, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'w-10 h-6',
    thumb: 'w-4 h-4 top-1',
    translate: '-translate-x-4',
  },
  md: {
    track: 'w-12 h-7 md:w-14 md:h-8',
    thumb: 'w-5 h-5 md:w-6 md:h-6 top-1',
    translate: '-translate-x-5 md:-translate-x-6',
  },
}

// Active color configurations
const COLOR_CONFIG: Record<string, { gradient: string; shadow: string }> = {
  primary: {
    gradient: 'bg-gradient-to-r from-cat-eye to-cat-glow',
    shadow: 'shadow-glow-sm',
  },
  warm: {
    gradient: 'bg-gradient-to-r from-accent-warm to-amber-500',
    shadow: 'shadow-glow-warm',
  },
  success: {
    gradient: 'bg-gradient-to-r from-accent-success to-emerald-500',
    shadow: 'shadow-glow-sm',
  },
  danger: {
    gradient: 'bg-gradient-to-r from-accent-danger to-red-500',
    shadow: '',
  },
}

const sizeConfig = computed(() => SIZE_CONFIG[props.size])
const colorConfig = computed(() => COLOR_CONFIG[props.activeColor])

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      :class="[
        'relative rounded-full transition-all duration-300 flex-shrink-0',
        sizeConfig.track,
        modelValue
          ? [colorConfig.gradient, colorConfig.shadow]
          : 'bg-night-surface',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ]"
      @click="toggle"
  >
    <span
        :class="[
          'absolute rounded-full shadow-md transition-all duration-300',
          sizeConfig.thumb,
          modelValue
            ? 'translate-x-0 bg-white'
            : [sizeConfig.translate, 'bg-txt-muted'],
        ]"
    />
  </button>
</template>
