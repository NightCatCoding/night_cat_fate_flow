<script setup lang="ts">
import {computed} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {useDraw, useMascotState} from '@/composables'
import {NAmbientBg, NButton, NCard, NFateButton, NInput} from '@/components/ui'
import {FateWheel} from '@/components/wheel'
import {DrawHistory} from '@/components/history'
import {MascotReaction} from '@/components/mascot'
import {ArrowLeft, Minus, Plus, RotateCcw, Settings2, Trophy, Users} from 'lucide-vue-next'
import type {ThemeColor} from '@/types'

defineOptions({name: 'DrawView'})

const gameStore = useGameStore()
const uiStore = useUiStore()

// 使用 useDraw composable 處理抽獎邏輯
const {
  currentCategory,
  availableItems,
  wonItems,
  startDraw,
  confirmResetWinners,
  selectCategory,
} = useDraw()

// 使用 useMascotState 處理吉祥物狀態
const {mascotState} = useMascotState('draw')

// 主題顏色樣式映射
const themeColorStyles: Record<ThemeColor, {
  text: string
  bg: string
  border: string
  gradient: string
  glow: string
}> = {
  cyan: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/30',
    gradient: 'from-cyan-400 via-teal-400 to-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]'
  },
  blue: {
    text: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
    gradient: 'from-blue-400 via-indigo-400 to-violet-400',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
  },
  purple: {
    text: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/30',
    gradient: 'from-purple-400 via-violet-400 to-fuchsia-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'
  },
  pink: {
    text: 'text-pink-400',
    bg: 'bg-pink-400/10',
    border: 'border-pink-400/30',
    gradient: 'from-pink-400 via-rose-400 to-red-400',
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]'
  },
  gold: {
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    gradient: 'from-amber-300 via-yellow-400 to-orange-400',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]'
  },
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    gradient: 'from-emerald-400 via-green-400 to-teal-400',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]'
  },
}

// 當前主題樣式
const currentTheme = computed(() => {
  const color = currentCategory.value?.themeColor || 'cyan'
  return themeColorStyles[color]
})

// 快速調整抽取人數
const adjustDrawCount = (delta: number) => {
  const newValue = Math.max(1, Math.min(100, uiStore.drawCount + delta))
  uiStore.setDrawCount(newValue)
}

// 返回配置頁面
const goBack = () => {
  uiStore.setView('setup')
}
</script>

<template>
  <div class="min-h-screen pt-1 md:pt-20 px-1 sm:px-6 pb-28 md:pb-8 animate-fade-in bg-night-deep">
    <!-- 共用背景光暈組件 - 旋轉時啟用動畫效果 -->
    <NAmbientBg :animated="uiStore.isSpinning" intensity="low"/>

    <div class="relative z-10 max-w-7xl mx-auto">
      <!-- Back Button - Desktop only -->
      <button
          class="hidden md:flex mb-8 items-center gap-2 text-txt-muted hover:text-cat-eye font-medium text-sm transition-colors group"
          @click="goBack"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
        返回配置
      </button>

      <!-- ========================================== -->
      <!-- MOBILE LAYOUT - 沉浸式全屏抽獎體驗 -->
      <!-- ========================================== -->
      <div class="lg:hidden flex flex-col">
        <!-- 頂部: 標題 + 統計 (使用動態主題色) -->
        <header class="text-center mb-1">
          <h1 :class="[
            'text-5xl sm:text-3xl font-display font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r mt-5 mb-5',
            currentTheme.gradient
          ]">
            {{ currentCategory?.name || '命運轉盤' }}
          </h1>
          <div class="flex justify-center gap-20 mt-1.5">
            <span :class="['text-lg font-mono font-semibold', currentTheme.text]">
              <Users class="w-5 h-5 inline mr-2"/>{{ availableItems.length }} 待抽
            </span>
            <span class="text-lg text-accent-warm font-mono font-semibold">
              <Trophy class="w-5 h-5 inline mr-2"/>{{ wonItems.length }} 已中
            </span>
          </div>
        </header>

        <!-- 核心焦點: 超大轉盤 -->
        <div class="flex justify-center -mx-1 mt-7 mb-7">
          <FateWheel :items="availableItems" size="xl"/>
        </div>

        <!-- 控制區域 -->
        <div class="mt-1 px-2 space-y-1.5">
          <!-- 抽取人數 + 重置 -->
          <div
              :class="[
                'flex items-center justify-between backdrop-blur-sm rounded-xl px-3 py-2 border transition-all duration-300',
                currentTheme.bg,
                currentTheme.border
              ]">
            <div class="flex items-center gap-2">
              <span class="text-xs text-txt-muted/70">抽取</span>
              <button
                  :class="[
                    'w-7 h-7 rounded-full flex items-center justify-center text-txt-muted transition-colors',
                    'bg-night-elevated/60 hover:' + currentTheme.text
                  ]"
                  @click="adjustDrawCount(-1)"
              >
                <Minus class="w-3.5 h-3.5"/>
              </button>
              <span :class="['w-8 text-center font-mono font-bold text-lg', currentTheme.text]">
                {{ uiStore.drawCount }}
              </span>
              <button
                  :class="[
                    'w-7 h-7 rounded-full flex items-center justify-center text-txt-muted transition-colors',
                    'bg-night-elevated/60 hover:' + currentTheme.text
                  ]"
                  @click="adjustDrawCount(1)"
              >
                <Plus class="w-3.5 h-3.5"/>
              </button>
              <span class="text-xs text-txt-muted/70">人</span>
            </div>

            <button
                class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-txt-muted/70 hover:text-accent-warm hover:bg-night-elevated/30 transition-colors"
                @click="confirmResetWinners"
            >
              <RotateCcw class="w-3.5 h-3.5"/>
              重置
            </button>
          </div>

          <!-- 分組快速切換 (使用各自主題色) -->
          <div
              v-if="gameStore.categories.length > 1"
              class="flex flex-wrap gap-1.5 justify-center"
          >
            <button
                v-for="category in gameStore.categories"
                :key="category.id"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-all',
                  gameStore.currentCategoryId === category.id
                    ? [themeColorStyles[category.themeColor].bg, themeColorStyles[category.themeColor].text, themeColorStyles[category.themeColor].border, 'border']
                    : 'bg-night-surface/30 text-txt-muted/70 border border-transparent'
                ]"
                @click="selectCategory(category.id)"
            >
              {{ category.name }}
            </button>
          </div>

          <!-- 待抽名單 (使用動態主題色) -->
          <div :class="[
            'backdrop-blur-sm rounded-xl p-2 border transition-all duration-300',
            currentTheme.bg,
            currentTheme.border
          ]">
            <div
                v-if="availableItems.length > 0"
                class="flex flex-wrap gap-1 justify-center max-h-[12vh] overflow-y-auto"
            >
              <span
                  v-for="item in availableItems"
                  :key="item.id"
                  :class="[
                    'px-2 py-0.5 rounded-full text-xs font-mono font-medium border',
                    currentTheme.bg,
                    currentTheme.text,
                    currentTheme.border
                  ]"
              >
                {{ item.name }}
              </span>
            </div>
            <div v-else class="text-center py-2 text-txt-muted/50 text-sm">
              🎉 全部抽完啦！
            </div>
          </div>

          <!-- 已中獎名單 -->
          <div v-if="wonItems.length > 0" class="flex flex-wrap gap-1 justify-center max-h-[5vh] overflow-y-auto">
            <span
                v-for="item in wonItems"
                :key="item.id"
                class="px-1.5 py-0.5 rounded-full text-[10px] font-mono
                     bg-night-elevated/20 text-txt-muted/40 line-through"
            >
              {{ item.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- DESKTOP LAYOUT - 完整三欄布局 -->
      <!-- ========================================== -->
      <div class="hidden lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <!-- LEFT COLUMN: Config Panel + Mascot -->
        <div class="lg:col-span-3 space-y-6">
          <div class="flex justify-center">
            <MascotReaction
                :state="mascotState"
                size="md"
                :show-bubble="true"
            />
          </div>

          <!-- Category Selector (使用各自主題色) -->
          <NCard
              v-if="gameStore.categories.length > 1"
              variant="glass"
              padding="md"
          >
            <h2 :class="['font-medium text-sm mb-4 flex items-center gap-2', currentTheme.text]">
              <Settings2 class="w-4 h-4"/>
              切換分組
            </h2>
            <div class="space-y-2">
              <button
                  v-for="category in gameStore.categories"
                  :key="category.id"
                  :class="[
                    'w-full p-3 rounded-2xl text-left transition-all duration-200 text-sm font-medium border',
                    gameStore.currentCategoryId === category.id
                      ? [themeColorStyles[category.themeColor].bg, themeColorStyles[category.themeColor].text, themeColorStyles[category.themeColor].border]
                      : 'hover:bg-glass-highlight text-txt-secondary border-transparent'
                  ]"
                  @click="selectCategory(category.id)"
              >
                <div class="flex items-center gap-3">
                  <div
                      :class="[
                        'w-3 h-3 rounded-full transition-all',
                        gameStore.currentCategoryId === category.id
                          ? themeColorStyles[category.themeColor].text.replace('text-', 'bg-')
                          : 'bg-night-muted'
                      ]"
                  />
                  {{ category.name }}
                </div>
              </button>
            </div>
          </NCard>

          <!-- Draw Settings -->
          <NCard variant="glass" padding="md">
            <h2 :class="['font-medium text-sm mb-4 flex items-center gap-2', currentTheme.text]">
              <Settings2 class="w-4 h-4"/>
              抽獎配置
            </h2>

            <div class="space-y-5">
              <div class="text-center">
                <label class="text-xs font-semibold text-txt-muted uppercase tracking-wider block mb-3">
                  抽取人數
                </label>
                <NInput
                    v-model="uiStore.drawCount"
                    type="number"
                    :min="1"
                    :max="100"
                    size="lg"
                    :mono="true"
                    class="text-center text-3xl font-bold"
                    @update:model-value="(v) => uiStore.setDrawCount(Number(v))"
                />
              </div>

              <NButton
                  variant="glass"
                  size="sm"
                  full-width
                  @click="confirmResetWinners"
              >
                <RotateCcw class="w-4 h-4"/>
                重置中獎狀態
              </NButton>
            </div>
          </NCard>

          <!-- Stats (使用動態主題色) -->
          <NCard variant="glow" padding="md" :class="currentTheme.glow">
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <div :class="['text-4xl font-mono font-bold', currentTheme.text]">
                  {{ availableItems.length }}
                </div>
                <div
                    class="text-xs text-txt-muted uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
                  <Users class="w-3 h-3"/>
                  剩餘
                </div>
              </div>
              <div>
                <div class="text-4xl font-mono font-bold text-accent-warm">
                  {{ wonItems.length }}
                </div>
                <div
                    class="text-xs text-txt-muted uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
                  <Trophy class="w-3 h-3"/>
                  已中獎
                </div>
              </div>
            </div>
          </NCard>
        </div>

        <!-- CENTER COLUMN: The Wheel -->
        <div class="lg:col-span-6 flex flex-col items-center">
          <header class="text-center mb-10">
            <h1 :class="[
              'text-5xl lg:text-6xl font-display font-bold tracking-wide mb-4 text-transparent bg-clip-text bg-gradient-to-r',
              currentTheme.gradient
            ]">
              {{ currentCategory?.name || '命運轉盤' }}
            </h1>
            <p class="text-txt-muted italic text-lg font-medium">
              命運的輪盤，裁決天選之人的誕生
            </p>
          </header>

          <FateWheel :items="availableItems"/>

          <div class="flex flex-col items-center mt-10">
            <NFateButton
                :disabled="availableItems.length === 0"
                :loading="uiStore.isSpinning"
                @activate="startDraw"
            />
          </div>

          <!-- Available items grid (使用動態主題色) -->
          <div class="mt-10 w-full max-w-xl">
            <div class="flex flex-wrap gap-2 justify-center">
              <span
                  v-for="item in currentCategory?.items || []"
                  :key="item.id"
                  :class="[
                    'px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all',
                    item.hasWon
                      ? 'bg-night-surface/30 text-txt-muted line-through'
                      : [currentTheme.bg, currentTheme.text, currentTheme.border, 'border']
                  ]"
              >
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: History -->
        <div class="lg:col-span-3 h-auto lg:max-h-[70vh]">
          <DrawHistory/>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MOBILE STICKY BOTTOM SPIN BUTTON (更大的按鈕) -->
    <!-- ========================================== -->
    <div class="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 lg:hidden pb-2">
      <NFateButton
          size="xl"
          :disabled="availableItems.length === 0"
          :loading="uiStore.isSpinning"
          @activate="startDraw"
      />
    </div>
  </div>
</template>
