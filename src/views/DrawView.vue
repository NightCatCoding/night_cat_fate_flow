<script setup lang="ts">
import {computed} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {useDraw, useMascotState} from '@/composables'
import {NAmbientBg, NButton, NCard, NFateButton, NInput} from '@/components/ui'
import {SlotMachine} from '@/components/wheel'
import {DrawHistory} from '@/components/history'
import {MascotReaction} from '@/components/mascot'
import {ArrowLeft, Minus, Plus, RotateCcw, Settings2, Trophy, Users} from 'lucide-vue-next'
import type {ThemeColor} from '@/types'

defineOptions({name: 'DrawView'})

const gameStore = useGameStore()
const uiStore = useUiStore()

// 使用 useDraw composable 处理抽奖逻辑
const {
  currentCategory,
  availableItems,
  wonItems,
  startDraw,
  confirmResetWinners,
  selectCategory,
} = useDraw()

// 使用 useMascotState 处理吉祥物状态
const {mascotState} = useMascotState('draw')

// 主题颜色样式映射
const themeColorStyles: Record<ThemeColor, {
  text: string
  textHex: string
  bg: string
  border: string
  gradient: string
  glow: string
  buttonGradient: string
  ambientColor: string
}> = {
  cyan: {
    text: 'text-cyan-400',
    textHex: '#22d3ee',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/30',
    gradient: 'from-cyan-400 via-teal-400 to-emerald-400',
    glow: 'shadow-[0_0_30px_rgba(34,211,238,0.4)]',
    buttonGradient: 'from-cyan-500 to-teal-500',
    ambientColor: 'rgba(34,211,238,0.15)'
  },
  blue: {
    text: 'text-blue-400',
    textHex: '#60a5fa',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
    gradient: 'from-blue-400 via-indigo-400 to-violet-400',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]',
    buttonGradient: 'from-blue-500 to-indigo-500',
    ambientColor: 'rgba(59,130,246,0.15)'
  },
  purple: {
    text: 'text-purple-400',
    textHex: '#c084fc',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/30',
    gradient: 'from-purple-400 via-violet-400 to-fuchsia-400',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]',
    buttonGradient: 'from-purple-500 to-violet-500',
    ambientColor: 'rgba(168,85,247,0.15)'
  },
  pink: {
    text: 'text-pink-400',
    textHex: '#f472b6',
    bg: 'bg-pink-400/10',
    border: 'border-pink-400/30',
    gradient: 'from-pink-400 via-rose-400 to-red-400',
    glow: 'shadow-[0_0_30px_rgba(236,72,153,0.4)]',
    buttonGradient: 'from-pink-500 to-rose-500',
    ambientColor: 'rgba(236,72,153,0.15)'
  },
  gold: {
    text: 'text-amber-400',
    textHex: '#fbbf24',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    gradient: 'from-amber-300 via-yellow-400 to-orange-400',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]',
    buttonGradient: 'from-amber-500 to-orange-500',
    ambientColor: 'rgba(251,191,36,0.15)'
  },
  emerald: {
    text: 'text-emerald-400',
    textHex: '#34d399',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    gradient: 'from-emerald-400 via-green-400 to-teal-400',
    glow: 'shadow-[0_0_30px_rgba(52,211,153,0.4)]',
    buttonGradient: 'from-emerald-500 to-green-500',
    ambientColor: 'rgba(52,211,153,0.15)'
  },
}

// 当前主题样式
const currentTheme = computed(() => {
  const color = currentCategory.value?.themeColor || 'cyan'
  return themeColorStyles[color]
})

// 当前主题颜色
const currentThemeColor = computed(() => currentCategory.value?.themeColor || 'cyan')

// 快速调整抽取人数
const adjustDrawCount = (delta: number) => {
  const newValue = Math.max(1, Math.min(100, uiStore.drawCount + delta))
  uiStore.setDrawCount(newValue)
}

// 返回配置页面
const goBack = () => {
  uiStore.setView('setup')
}
</script>

<template>
  <div class="min-h-screen pt-1 md:pt-20 px-1 sm:px-6 pb-28 md:pb-8 animate-fade-in bg-night-deep">
    <!-- 动态背景光晕 - 根据主题色变化 -->
    <div
        class="fixed inset-0 pointer-events-none transition-all duration-700"
        :style="{
        background: `radial-gradient(ellipse at 50% 30%, ${currentTheme.ambientColor} 0%, transparent 60%)`
      }"
    />
    <NAmbientBg :animated="uiStore.isSpinning" intensity="low"/>

    <div class="relative z-10 max-w-7xl mx-auto">
      <!-- Back Button - Desktop only -->
      <button
          :class="[
          'hidden md:flex mb-8 items-center gap-2 font-medium text-sm transition-colors group',
          'text-txt-muted hover:' + currentTheme.text
        ]"
          @click="goBack"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
        返回配置
      </button>

      <!-- ========================================== -->
      <!-- MOBILE LAYOUT - 沉浸式全屏抽奖体验 -->
      <!-- ========================================== -->
      <div class="lg:hidden flex flex-col">
        <!-- 顶部: 标题 + 统计 (使用动态主题色) -->
        <header class="text-center mb-3">
          <h1 :class="[
            'text-3xl sm:text-4xl font-display font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r mt-3 mb-3',
            currentTheme.gradient
          ]">
            {{ currentCategory?.name || '命运转盘' }}
          </h1>
          <div class="flex justify-center gap-8 mt-1">
            <span :class="['text-base font-mono font-semibold flex items-center gap-1.5', currentTheme.text]">
              <Users class="w-4 h-4"/>{{ availableItems.length }} 待抽
            </span>
            <span class="text-base text-accent-warm font-mono font-semibold flex items-center gap-1.5">
              <Trophy class="w-4 h-4"/>{{ wonItems.length }} 已中
            </span>
          </div>
        </header>

        <!-- 核心焦点: 水车式滚动 -->
        <div class="flex justify-center my-4">
          <SlotMachine
              :items="availableItems"
              :theme-color="currentThemeColor"
          />
        </div>

        <!-- 控制区域 -->
        <div class="mt-2 px-2 space-y-2">
          <!-- 抽取人数 + 重置 -->
          <div
              :class="[
              'flex items-center justify-between backdrop-blur-sm rounded-xl px-3 py-2.5 border transition-all duration-300',
              currentTheme.bg,
              currentTheme.border
            ]">
            <div class="flex items-center gap-2">
              <span class="text-xs text-txt-muted/70">抽取</span>
              <button
                  :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                  currentTheme.bg, currentTheme.border, 'border',
                  'active:scale-90'
                ]"
                  @click="adjustDrawCount(-1)"
              >
                <Minus :class="['w-4 h-4', currentTheme.text]"/>
              </button>
              <span :class="['w-10 text-center font-mono font-bold text-xl', currentTheme.text]">
                {{ uiStore.drawCount }}
              </span>
              <button
                  :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                  currentTheme.bg, currentTheme.border, 'border',
                  'active:scale-90'
                ]"
                  @click="adjustDrawCount(1)"
              >
                <Plus :class="['w-4 h-4', currentTheme.text]"/>
              </button>
              <span class="text-xs text-txt-muted/70">人</span>
            </div>

            <button
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-txt-muted/70 hover:text-accent-warm hover:bg-accent-warm/10 transition-colors"
                @click="confirmResetWinners"
            >
              <RotateCcw class="w-3.5 h-3.5"/>
              重置
            </button>
          </div>

          <!-- 分组快速切换 (使用各自主题色) -->
          <div
              v-if="gameStore.categories.length > 1"
              class="flex flex-wrap gap-1.5 justify-center py-1"
          >
            <button
                v-for="category in gameStore.categories"
                :key="category.id"
                :class="[
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                gameStore.currentCategoryId === category.id
                  ? [
                      themeColorStyles[category.themeColor].bg,
                      themeColorStyles[category.themeColor].text,
                      themeColorStyles[category.themeColor].border,
                      'border',
                      themeColorStyles[category.themeColor].glow
                    ]
                  : 'bg-night-surface/30 text-txt-muted/70 border border-transparent hover:bg-night-surface/50'
              ]"
                @click="selectCategory(category.id)"
            >
              {{ category.name }}
            </button>
          </div>

          <!-- 已中奖名单 -->
          <div v-if="wonItems.length > 0" class="flex flex-wrap gap-1 justify-center max-h-[8vh] overflow-y-auto py-1">
            <span
                v-for="item in wonItems"
                :key="item.id"
                class="px-2 py-0.5 rounded-full text-[10px] font-mono
                   bg-night-elevated/20 text-txt-muted/40 line-through"
            >
              {{ item.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- DESKTOP LAYOUT - 完整三栏布局 -->
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

          <!-- Category Selector (使用各自主题色) -->
          <NCard
              v-if="gameStore.categories.length > 1"
              variant="glass"
              padding="md"
          >
            <h2 :class="['font-medium text-sm mb-4 flex items-center gap-2', currentTheme.text]">
              <Settings2 class="w-4 h-4"/>
              切换分组
            </h2>
            <div class="space-y-2">
              <button
                  v-for="category in gameStore.categories"
                  :key="category.id"
                  :class="[
                  'w-full p-3 rounded-2xl text-left transition-all duration-200 text-sm font-medium border',
                  gameStore.currentCategoryId === category.id
                    ? [
                        themeColorStyles[category.themeColor].bg,
                        themeColorStyles[category.themeColor].text,
                        themeColorStyles[category.themeColor].border,
                        themeColorStyles[category.themeColor].glow
                      ]
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
              抽奖配置
            </h2>

            <div class="space-y-5">
              <div class="text-center">
                <label class="text-xs font-semibold text-txt-muted uppercase tracking-wider block mb-3">
                  抽取人数
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
                重置中奖状态
              </NButton>
            </div>
          </NCard>

          <!-- Stats (使用动态主题色) -->
          <NCard variant="glow" padding="md" :class="currentTheme.glow">
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <div :class="['text-4xl font-mono font-bold', currentTheme.text]">
                  {{ availableItems.length }}
                </div>
                <div
                    class="text-xs text-txt-muted uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
                  <Users class="w-3 h-3"/>
                  剩余
                </div>
              </div>
              <div>
                <div class="text-4xl font-mono font-bold text-accent-warm">
                  {{ wonItems.length }}
                </div>
                <div
                    class="text-xs text-txt-muted uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
                  <Trophy class="w-3 h-3"/>
                  已中奖
                </div>
              </div>
            </div>
          </NCard>
        </div>

        <!-- CENTER COLUMN: The Slot Machine -->
        <div class="lg:col-span-6 flex flex-col items-center">
          <header class="text-center mb-8">
            <h1 :class="[
              'text-5xl lg:text-6xl font-display font-bold tracking-wide mb-4 text-transparent bg-clip-text bg-gradient-to-r',
              currentTheme.gradient
            ]">
              {{ currentCategory?.name || '命运转盘' }}
            </h1>
            <p class="text-txt-muted italic text-lg font-medium">
              命运的转轮，裁决天选之人的诞生
            </p>
          </header>

          <SlotMachine
              :items="availableItems"
              :theme-color="currentThemeColor"
          />

          <div class="flex flex-col items-center mt-8">
            <NFateButton
                :disabled="availableItems.length === 0"
                :loading="uiStore.isSpinning"
                @activate="startDraw"
            />
          </div>

          <!-- Available items grid (使用动态主题色) -->
          <div class="mt-8 w-full max-w-xl">
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
    <!-- MOBILE STICKY BOTTOM SPIN BUTTON -->
    <!-- ========================================== -->
    <div class="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 lg:hidden pb-2">
      <NFateButton
          size="lg"
          :disabled="availableItems.length === 0"
          :loading="uiStore.isSpinning"
          @activate="startDraw"
      />
    </div>
  </div>
</template>
