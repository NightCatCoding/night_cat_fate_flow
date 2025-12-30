<script setup lang="ts">
import {useGameStore, useUiStore} from '@/stores'
import {useExcel} from '@/composables'
import {NButton, NCard} from '@/components/ui'
import {Clock, Download, History, Trash2, Trophy} from 'lucide-vue-next'

const gameStore = useGameStore()
const uiStore = useUiStore()
const {exportHistory} = useExcel()

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
    message: '确定要清空所有抽奖历史记录吗？此操作无法撤销。',
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
    <!-- Header -->
    <div class="px-4 md:px-6 py-4 md:py-5 border-b border-glass-border flex items-center justify-between flex-shrink-0">
      <h2 class="font-semibold text-sm md:text-base text-cat-eye flex items-center gap-2">
        <Trophy class="w-4 h-4"/>
        中奖历史
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
        <p class="font-medium text-sm md:text-base">暂无抽奖记录</p>
        <p class="text-xs md:text-sm mt-1 opacity-70">开始抽奖后记录显示在这里</p>
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
            class="p-3 md:p-4 rounded-2xl md:rounded-3xl bg-glass-white border border-glass-border
                 hover:border-cat-eye/30 hover:shadow-glow-sm transition-all duration-300
                 active:scale-[0.98]"
        >
          <!-- Time and Category -->
          <div class="flex items-center justify-between mb-2 md:mb-3">
            <span class="text-xs md:text-sm font-semibold text-cat-eye truncate max-w-[60%]">
              {{ record.categoryName }}
            </span>
            <span
                class="text-[10px] md:text-xs text-txt-muted font-medium flex items-center gap-1 md:gap-1.5 flex-shrink-0">
              <Clock class="w-3 h-3"/>
              {{ formatTime(record.timestamp) }}
            </span>
          </div>

          <!-- Winners -->
          <div class="flex flex-wrap gap-1.5 md:gap-2">
            <span
                v-for="winner in record.winners"
                :key="winner.id"
                class="px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-mono font-semibold
                     bg-gradient-to-r from-cat-eye to-cat-glow text-night-void"
            >
              {{ winner.name }}
            </span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </NCard>
</template>
