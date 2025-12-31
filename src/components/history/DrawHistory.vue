<script setup lang="ts">
import {computed} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {useExcel} from '@/composables'
import {NButton, NCard} from '@/components/ui'
import {Clock, Download, History, Trash2, Trophy} from 'lucide-vue-next'
import type {ThemeColor} from '@/types'

const gameStore = useGameStore()
const uiStore = useUiStore()
const {exportHistory} = useExcel()

// 颜色样式映射
const colorStyles: Record<ThemeColor, {
  text: string
  border: string
  bg: string
  gradient: string
  glow: string
}> = {
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-400/30',
    bg: 'bg-cyan-400/10',
    gradient: 'from-cyan-400 to-teal-500',
    glow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]'
  },
  blue: {
    text: 'text-blue-400',
    border: 'border-blue-400/30',
    bg: 'bg-blue-400/10',
    gradient: 'from-blue-400 to-indigo-500',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]'
  },
  purple: {
    text: 'text-purple-400',
    border: 'border-purple-400/30',
    bg: 'bg-purple-400/10',
    gradient: 'from-violet-400 to-purple-600',
    glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
  },
  pink: {
    text: 'text-pink-400',
    border: 'border-pink-400/30',
    bg: 'bg-pink-400/10',
    gradient: 'from-pink-400 to-rose-500',
    glow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]'
  },
  gold: {
    text: 'text-amber-400',
    border: 'border-amber-400/30',
    bg: 'bg-amber-400/10',
    gradient: 'from-amber-300 to-orange-500',
    glow: 'hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]'
  },
  emerald: {
    text: 'text-emerald-400',
    border: 'border-emerald-400/30',
    bg: 'bg-emerald-400/10',
    gradient: 'from-emerald-400 to-green-600',
    glow: 'hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]'
  },
}

// 获取当前分组的主题颜色
const currentThemeColor = computed(() => {
  const currentCategory = gameStore.categories.find(c => c.id === gameStore.currentCategoryId)
  return currentCategory?.themeColor || 'cyan'
})

// 当前主题样式
const themeStyle = computed(() => colorStyles[currentThemeColor.value])

// 根据历史记录的分组获取对应颜色
const getRecordColorStyle = (categoryName: string) => {
  const category = gameStore.categories.find(c => c.name === categoryName)
  const color = category?.themeColor || 'cyan'
  return colorStyles[color]
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const confirmClearHistory = () => {
  if (gameStore.history.length === 0) return

  uiStore.openConfirm({
    title: '清空历史',
    message: '确定要清空所有抽选记录吗？此操作无法撤销。',
    confirmText: '清空',
    variant: 'danger',
    onConfirm: () => {
      gameStore.clearHistory()
      uiStore.addToast('历史已清空', 'success')
    },
  })
}
</script>

<template>
  <NCard variant="glass" padding="none" class="h-full flex flex-col overflow-hidden">
    <!-- Header - 使用当前分组主题颜色 -->
    <div class="px-4 md:px-6 py-4 md:py-5 border-b border-glass-border flex items-center justify-between flex-shrink-0">
      <h2 :class="['font-semibold text-sm md:text-base flex items-center gap-2 transition-colors duration-300', themeStyle.text]">
        <Trophy class="w-4 h-4"/>
        抽选记录
        <span v-if="gameStore.history.length > 0" class="text-xs text-txt-muted font-normal">
          ({{ gameStore.history.length }})
        </span>
      </h2>
      <div class="flex items-center gap-1 md:gap-2">
        <NButton
            v-if="gameStore.history.length > 0"
            size="xs"
            variant="ghost"
            @click="exportHistory"
        >
          <Download class="w-3.5 h-3.5"/>
          <span class="hidden sm:inline text-xs">导出</span>
        </NButton>
        <NButton
            v-if="gameStore.history.length > 0"
            size="xs"
            variant="ghost"
            @click="confirmClearHistory"
        >
          <Trash2 class="w-3.5 h-3.5 text-accent-danger"/>
        </NButton>
      </div>
    </div>

    <!-- History List -->
    <div class="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
      <div
          v-if="gameStore.history.length === 0"
          class="text-center py-12 md:py-16 text-txt-muted"
      >
        <History class="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 opacity-30"/>
        <p class="font-medium text-sm md:text-base">暂无抽选记录</p>
        <p class="text-xs md:text-sm mt-1 opacity-70">开始抽选后记录显示在这里</p>
      </div>

      <TransitionGroup
          enter-active-class="transition-all duration-400 ease-out"
          enter-from-class="opacity-0 -translate-y-3"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div
            v-for="record in gameStore.history"
            :key="record.id"
            :class="[
            'p-3 md:p-4 rounded-2xl md:rounded-3xl bg-glass-white border transition-all duration-300 active:scale-[0.98]',
            getRecordColorStyle(record.categoryName).border,
            getRecordColorStyle(record.categoryName).glow
          ]"
        >
          <!-- Time and Category - 使用该记录分组的主题颜色 -->
          <div class="flex items-center justify-between mb-2 md:mb-3">
            <span
                :class="['text-xs md:text-sm font-semibold truncate max-w-[60%]', getRecordColorStyle(record.categoryName).text]">
              {{ record.categoryName }}
            </span>
            <span
                class="text-[10px] md:text-xs text-txt-muted font-medium flex items-center gap-1 md:gap-1.5 flex-shrink-0">
              <Clock class="w-3 h-3"/>
              {{ formatTime(record.timestamp) }}
            </span>
          </div>

          <!-- Winners - 使用该记录分组的渐变色 -->
          <div class="flex flex-wrap gap-1.5 md:gap-2">
            <span
                v-for="winner in record.winners"
                :key="winner.id"
                :class="[
                'px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-mono font-semibold bg-gradient-to-r text-white',
                getRecordColorStyle(record.categoryName).gradient
              ]"
            >
              {{ winner.name }}
            </span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </NCard>
</template>
