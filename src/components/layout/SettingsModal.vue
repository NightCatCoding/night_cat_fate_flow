<script setup lang="ts">
import {useGameStore, useUiStore} from '@/stores'
import {NButton, NModal} from '@/components/ui'
import {PartyPopper, RotateCcw, Timer, Trash2} from 'lucide-vue-next'

defineOptions({name: 'SettingsModal'})

const gameStore = useGameStore()
const uiStore = useUiStore()

// 更新旋转时间
const updateSpinDuration = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value)
  gameStore.updateSettings({spinDuration: value})
}

// 更新洒花时长
const updateConfettiDuration = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value)
  gameStore.updateSettings({confettiDuration: value})
}

const confirmResetAll = () => {
  uiStore.closeSettingsModal()

  uiStore.openConfirm({
    title: '重置所有数据',
    message: '确定要清空所有分组、成员和历史记录吗？此操作无法撤销！',
    confirmText: '全部清空',
    variant: 'danger',
    onConfirm: () => {
      gameStore.resetAllData()
      gameStore.initializeDefaultCategory()
      uiStore.addToast('数据已重置', 'success')
    },
  })
}
</script>

<template>
  <NModal
      v-model="uiStore.showSettingsModal"
      title="设置"
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
            <h3 class="font-semibold text-sm md:text-base text-txt-primary">中奖后移除</h3>
            <p class="text-xs md:text-sm text-txt-muted">中奖者不再参与后续</p>
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

      <!-- Spin Duration Slider -->
      <div class="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-glass-white backdrop-blur-sm border border-glass-border">
        <div class="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
          <div
              class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-cat-eye/20 text-cat-eye">
            <Timer class="w-4 h-4 md:w-5 md:h-5"/>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-sm md:text-base text-txt-primary">旋转时间</h3>
            <p class="text-xs md:text-sm text-txt-muted">转盘滚动持续时间</p>
          </div>
          <div class="text-right">
            <span class="text-2xl md:text-3xl font-mono font-bold text-cat-eye">
              {{ gameStore.settings.spinDuration }}
            </span>
            <span class="text-xs md:text-sm text-txt-muted ml-1">秒</span>
          </div>
        </div>

        <!-- 滑动条 -->
        <div class="relative px-1">
          <div class="relative h-3 md:h-4 bg-night-surface/50 rounded-full overflow-hidden">
            <div
                class="absolute left-0 top-0 h-full bg-gradient-to-r from-cat-eye to-cat-glow rounded-full transition-all duration-150"
                :style="{ width: `${(gameStore.settings.spinDuration - 1) / 9 * 100}%` }"
            />
          </div>
          <input
              type="range"
              min="1"
              max="10"
              step="1"
              :value="gameStore.settings.spinDuration"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              @input="updateSpinDuration"
          />
          <div
              class="absolute top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 bg-white rounded-full shadow-lg border-2 border-cat-eye transition-all duration-150 pointer-events-none"
              :style="{ left: `calc(${(gameStore.settings.spinDuration - 1) / 9 * 100}% - ${gameStore.settings.spinDuration === 1 ? '0px' : gameStore.settings.spinDuration === 10 ? '24px' : '12px'})` }"
          />
        </div>
        <div class="flex justify-between mt-2 px-1">
          <span class="text-[10px] md:text-xs text-txt-muted/60">1秒</span>
          <span class="text-[10px] md:text-xs text-txt-muted/60">10秒</span>
        </div>
      </div>

      <!-- Confetti Duration Slider -->
      <div class="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-glass-white backdrop-blur-sm border border-glass-border">
        <div class="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
          <div
              class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-pink-500/20 text-pink-400">
            <PartyPopper class="w-4 h-4 md:w-5 md:h-5"/>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-sm md:text-base text-txt-primary">洒花时长</h3>
            <p class="text-xs md:text-sm text-txt-muted">中奖庆祝效果持续时间</p>
          </div>
          <div class="text-right">
            <span class="text-2xl md:text-3xl font-mono font-bold text-pink-400">
              {{ gameStore.settings.confettiDuration }}
            </span>
            <span class="text-xs md:text-sm text-txt-muted ml-1">秒</span>
          </div>
        </div>

        <!-- 滑动条 -->
        <div class="relative px-1">
          <div class="relative h-3 md:h-4 bg-night-surface/50 rounded-full overflow-hidden">
            <div
                class="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-150"
                :style="{ width: `${(gameStore.settings.confettiDuration - 1) / 9 * 100}%` }"
            />
          </div>
          <input
              type="range"
              min="1"
              max="10"
              step="1"
              :value="gameStore.settings.confettiDuration"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              @input="updateConfettiDuration"
          />
          <div
              class="absolute top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 bg-white rounded-full shadow-lg border-2 border-pink-400 transition-all duration-150 pointer-events-none"
              :style="{ left: `calc(${(gameStore.settings.confettiDuration - 1) / 9 * 100}% - ${gameStore.settings.confettiDuration === 1 ? '0px' : gameStore.settings.confettiDuration === 10 ? '24px' : '12px'})` }"
          />
        </div>
        <div class="flex justify-between mt-2 px-1">
          <span class="text-[10px] md:text-xs text-txt-muted/60">1秒</span>
          <span class="text-[10px] md:text-xs text-txt-muted/60">10秒</span>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-accent-danger/10 border border-accent-danger/30">
        <h3 class="font-semibold text-sm md:text-base text-accent-danger mb-2 flex items-center gap-2">
          <Trash2 class="w-4 h-4"/>
          危险操作
        </h3>
        <p class="text-xs md:text-sm text-txt-muted mb-3 md:mb-4">
          此操作将清空所有数据
        </p>
        <NButton
            variant="danger"
            size="sm"
            @click="confirmResetAll"
        >
          重置所有数据
        </NButton>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <NButton variant="ghost" size="lg" class="w-full md:w-auto" @click="uiStore.closeSettingsModal">
          关闭
        </NButton>
      </div>
    </template>
  </NModal>
</template>
