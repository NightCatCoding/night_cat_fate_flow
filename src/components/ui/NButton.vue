<script setup lang="ts">
import {computed} from 'vue'

defineOptions({name: 'NButton'})

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  icon: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Static base classes as a single string for better performance
const BASE_CLASSES = `
  inline-flex items-center justify-center font-semibold
  transition-all duration-300 ease-out
  focus:outline-none focus-visible:ring-2 focus-visible:ring-cat-eye/50 focus-visible:ring-offset-2 focus-visible:ring-offset-night-deep
  disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
  active:scale-[0.97]
  rounded-full
`.trim().replace(/\s+/g, ' ')

// Size class mappings
const ICON_SIZE_CLASSES: Record<string, string> = {
  xs: 'p-1.5',
  sm: 'p-2',
  md: 'p-2.5',
  lg: 'p-3',
  xl: 'p-4',
}

const BUTTON_SIZE_CLASSES: Record<string, string> = {
  xs: 'px-3 py-1.5 text-xs gap-1.5',
  sm: 'px-4 py-2.5 md:py-2 text-sm gap-2 min-h-[40px] md:min-h-[36px]',
  md: 'px-6 py-3.5 md:py-3 text-base gap-2 min-h-[48px] md:min-h-[44px]',
  lg: 'px-8 py-4 text-lg gap-2.5 min-h-[52px] md:min-h-[48px]',
  xl: 'px-10 py-5 text-xl gap-3 min-h-[56px] md:min-h-[52px]',
}

// Variant class mappings - pre-joined strings for performance
const VARIANT_CLASSES: Record<string, string> = {
  primary: 'bg-gradient-to-r from-cat-eye to-cat-glow text-night-void font-bold shadow-glow hover:shadow-glow-lg hover:from-cat-spark hover:to-cat-eye border border-cat-spark/30',
  secondary: 'bg-cat-eye/10 backdrop-blur-xl text-cat-eye border border-cat-eye/20 hover:bg-cat-eye/20 hover:border-cat-eye/40 shadow-glass',
  ghost: 'bg-transparent text-txt-secondary hover:text-cat-eye hover:bg-glass-white',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg shadow-red-500/25 hover:from-red-400 hover:to-red-500 border border-red-400/30',
  glass: 'bg-glass-white backdrop-blur-xl text-txt-primary border border-glass-border hover:bg-glass-highlight hover:border-glass-highlight shadow-glass',
}

const sizeClasses = computed(() => {
  return props.icon
      ? ICON_SIZE_CLASSES[props.size]
      : BUTTON_SIZE_CLASSES[props.size]
})

const variantClasses = computed(() => VARIANT_CLASSES[props.variant])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
      :class="[BASE_CLASSES, sizeClasses, variantClasses, { 'w-full': fullWidth }]"
      :disabled="disabled || loading"
      @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
        v-if="loading"
        class="animate-spin -ml-1 h-4 w-4"
        :class="size === 'xs' || size === 'sm' ? 'h-3 w-3' : 'h-5 w-5'"
        fill="none"
        viewBox="0 0 24 24"
    >
      <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
      />
      <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot/>
  </button>
</template>
