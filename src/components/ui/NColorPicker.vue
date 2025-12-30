<script setup lang="ts">
import type {ThemeColor} from '@/types'
import {Check} from 'lucide-vue-next'

interface Props {
  modelValue: ThemeColor
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: ThemeColor]
}>()

// 丰富的颜色选项
const colors: { value: ThemeColor; label: string; gradient: string; glow: string }[] = [
  {
    value: 'cyan',
    label: '青色',
    gradient: 'bg-gradient-to-br from-cyan-400 to-teal-500',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.6)]'
  },
  {
    value: 'blue',
    label: '蓝色',
    gradient: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.6)]'
  },
  {
    value: 'purple',
    label: '紫色',
    gradient: 'bg-gradient-to-br from-violet-400 to-purple-600',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.6)]'
  },
  {
    value: 'pink',
    label: '粉色',
    gradient: 'bg-gradient-to-br from-pink-400 to-rose-500',
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.6)]'
  },
  {
    value: 'gold',
    label: '金色',
    gradient: 'bg-gradient-to-br from-amber-300 to-orange-500',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.6)]'
  },
  {
    value: 'emerald',
    label: '翠绿',
    gradient: 'bg-gradient-to-br from-emerald-400 to-green-600',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.6)]'
  },
]

const selectColor = (color: ThemeColor) => {
  emit('update:modelValue', color)
}
</script>

<template>
  <div class="grid grid-cols-6 gap-2 sm:gap-3">
    <button
        v-for="color in colors"
        :key="color.value"
        :class="[
        'aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300',
        color.gradient,
        props.modelValue === color.value
          ? ['ring-2 ring-white ring-offset-2 ring-offset-night-deep scale-110', color.glow]
          : 'hover:scale-105 opacity-70 hover:opacity-100'
      ]"
        :title="color.label"
        @click="selectColor(color.value)"
    >
      <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-50"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-50"
      >
        <Check
            v-if="props.modelValue === color.value"
            class="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            :stroke-width="3"
        />
      </Transition>
    </button>
  </div>

  <!-- 选中颜色预览 -->
  <div class="mt-4 flex items-center gap-3">
    <div
        :class="[
        'w-4 h-4 rounded-full transition-all duration-300',
        colors.find(c => c.value === props.modelValue)?.gradient,
        colors.find(c => c.value === props.modelValue)?.glow
      ]"
    />
    <span class="text-sm text-txt-secondary font-medium">
      已选择: {{ colors.find(c => c.value === props.modelValue)?.label }}
    </span>
  </div>
</template>
