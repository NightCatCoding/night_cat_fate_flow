<script setup lang="ts">
import {computed} from 'vue'

defineOptions({name: 'NCard'})

interface Props {
  variant?: 'default' | 'glass' | 'solid' | 'glow'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'glass',
  padding: 'md',
  hoverable: false,
})

// 內邊距映射
const PADDING_MAP = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const

// 變體樣式映射 - 使用 @layer components 中定義的類
const VARIANT_MAP = {
  glass: 'glass-card',
  glow: 'glass-card-glow',
  solid: 'rounded-4xl transition-all duration-300 bg-night-surface border border-night-elevated/50 shadow-lg shadow-black/20',
  default: 'rounded-4xl transition-all duration-300 bg-night-surface/50 backdrop-blur-sm border border-night-elevated/30',
} as const

const cardClasses = computed(() => {
  const classes: string[] = [
    VARIANT_MAP[props.variant],
    PADDING_MAP[props.padding],
  ]

  // 懸停效果 - 使用 glass-card-hoverable 的部分樣式
  if (props.hoverable) {
    classes.push('cursor-pointer hover:bg-glass-highlight hover:border-cat-eye/30 hover:shadow-glow-sm hover:scale-[1.01]')
  }

  return classes.filter(Boolean).join(' ')
})
</script>

<template>
  <div :class="cardClasses">
    <slot/>
  </div>
</template>
