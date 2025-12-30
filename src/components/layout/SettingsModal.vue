<script setup lang="ts">
import {useGameStore, useUiStore} from '@/stores'
import {NButton, NModal} from '@/components/ui'
import {PartyPopper, RotateCcw, Trash2, Zap} from 'lucide-vue-next'

defineOptions({name: 'SettingsModal'})

const gameStore = useGameStore()
const uiStore = useUiStore()

type AnimationSpeed = 'slow' | 'normal' | 'fast'
type ConfettiDuration = 'short' | 'normal' | 'long' | 'epic'

interface SpeedOption {
  value: AnimationSpeed
  label: string
  duration: string
}

interface ConfettiOption {
  value: ConfettiDuration
  label: string
  desc: string
}

const speedOptions: SpeedOption[] = [
  {value: 'slow', label: '慢速', duration: '7s'},
  {value: 'normal', label: '正常', duration: '5s'},
  {value: 'fast', label: '快速', duration: '3s'},
]

const confettiOptions: ConfettiOption[] = [
  {value: 'short', label: '簡短', desc: '2-3秒'},
  {value: 'normal', label: '正常', desc: '4-5秒'},
  {value: 'long', label: '豪華', desc: '6-8秒'},
  {value: 'epic', label: '史詩', desc: '8-10秒'},
]

const confirmResetAll = () => {
  uiStore.closeSettingsModal()

  uiStore.openConfirm({
    title: '重置所有數據',
    message: '確定要清空所有分組、成員和歷史記錄嗎？此操作無法撤銷！',
    confirmText: '全部清空',
    variant: 'danger',
    onConfirm: () => {
      gameStore.resetAllData()
      gameStore.initializeDefaultCategory()
      uiStore.addToast('數據已重置', 'success')
    },
  })
}
</script>

<template>
  <NModal
      v-model="uiStore.showSettingsModal"
      title="設置"
      size="sm"
      mobile-style="bottom-sheet"
  >
    <div class="space-y-4 md:space-y-5">
      <!-- Remove After Win Toggle -->
      <div
          class="flex items-center justify-between p-4 md:p-5 rounded-2xl md:rounded-3xl bg-glass-white backdrop-blur-sm border border-glass-border">
        <div class="flex items-center gap-3 md:gap-4">
          <div :class="[
            'w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300',
            gameStore.settings.removeAfterWin
              ? 'bg-accent-warm/20 text-accent-warm'
              : 'bg-night-surface text-txt-muted'
          ]">
            <RotateCcw class="w-4 h-4 md:w-5 md:h-5"/>
          </div>
          <div>
            <h3 class="font-semibold text-sm md:text-base text-txt-primary">中獎後移除</h3>
            <p class="text-xs md:text-sm text-txt-muted">中獎者不再參與後續</p>
          </div>
        </div>
        <button
            :class="[
            'relative w-12 h-7 md:w-14 md:h-8 rounded-full transition-all duration-300 flex-shrink-0',
            gameStore.settings.removeAfterWin
              ? 'bg-gradient-to-r from-accent-warm to-amber-500 shadow-glow-warm'
              : 'bg-night-surface'
          ]"
            @click="gameStore.updateSettings({ removeAfterWin: !gameStore.settings.removeAfterWin })"
        >
          <span
              :class="[
              'absolute top-1 w-5 h-5 md:w-6 md:h-6 rounded-full shadow-md transition-all duration-300',
              gameStore.settings.removeAfterWin
                ? 'translate-x-0 bg-white'
                : '-translate-x-5 md:-translate-x-6 bg-txt-muted'
            ]"
          />
        </button>
      </div>

      <!-- Animation Speed -->
      <div class="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-glass-white backdrop-blur-sm border border-glass-border">
        <div class="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
          <div
              class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-cat-eye/20 text-cat-eye">
            <Zap class="w-4 h-4 md:w-5 md:h-5"/>
          </div>
          <div>
            <h3 class="font-semibold text-sm md:text-base text-txt-primary">動畫速度</h3>
            <p class="text-xs md:text-sm text-txt-muted">轉盤旋轉速度</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 md:gap-3">
          <button
              v-for="option in speedOptions"
              :key="option.value"
              :class="[
              'p-3 md:p-4 rounded-xl md:rounded-2xl text-center transition-all duration-300 font-medium active:scale-95',
              gameStore.settings.animationSpeed === option.value
                ? 'bg-gradient-to-r from-cat-eye to-cat-glow text-night-void shadow-glow-sm'
                : 'bg-night-surface/50 hover:bg-night-surface text-txt-secondary'
            ]"
              @click="gameStore.updateSettings({ animationSpeed: option.value })"
          >
            <div class="font-semibold text-xs md:text-sm">{{ option.label }}</div>
            <div class="text-[10px] md:text-xs opacity-70 mt-1">{{ option.duration }}</div>
          </button>
        </div>
      </div>

      <!-- Confetti Duration -->
      <div class="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-glass-white backdrop-blur-sm border border-glass-border">
        <div class="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
          <div
              class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-pink-500/20 text-pink-400">
            <PartyPopper class="w-4 h-4 md:w-5 md:h-5"/>
          </div>
          <div>
            <h3 class="font-semibold text-sm md:text-base text-txt-primary">灑花時長</h3>
            <p class="text-xs md:text-sm text-txt-muted">中獎慶祝效果持續時間</p>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-1.5 md:gap-2">
          <button
              v-for="option in confettiOptions"
              :key="option.value"
              :class="[
              'p-2 md:p-3 rounded-xl md:rounded-2xl text-center transition-all duration-300 font-medium active:scale-95',
              gameStore.settings.confettiDuration === option.value
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-glow-sm'
                : 'bg-night-surface/50 hover:bg-night-surface text-txt-secondary'
            ]"
              @click="gameStore.updateSettings({ confettiDuration: option.value })"
          >
            <div class="font-semibold text-[10px] md:text-xs">{{ option.label }}</div>
            <div class="text-[9px] md:text-[10px] opacity-70 mt-0.5">{{ option.desc }}</div>
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-accent-danger/10 border border-accent-danger/30">
        <h3 class="font-semibold text-sm md:text-base text-accent-danger mb-2 flex items-center gap-2">
          <Trash2 class="w-4 h-4"/>
          危險操作
        </h3>
        <p class="text-xs md:text-sm text-txt-muted mb-3 md:mb-4">
          此操作將清空所有數據
        </p>
        <NButton
            variant="danger"
            size="sm"
            @click="confirmResetAll"
        >
          重置所有數據
        </NButton>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <NButton variant="ghost" size="lg" class="w-full md:w-auto" @click="uiStore.closeSettingsModal">
          關閉
        </NButton>
      </div>
    </template>
  </NModal>
</template>
