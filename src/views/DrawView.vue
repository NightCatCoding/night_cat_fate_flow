<script setup lang="ts">
import {computed} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {useDraw, useMascotState} from '@/composables'
import {NAmbientBg, NButton, NCard, NFateButton, NInput} from '@/components/ui'
import {SlotMachine} from '@/components/wheel'
import {DrawHistory} from '@/components/history'
import {ParticipantPool} from '@/components/draw'
import {MascotReaction} from '@/components/mascot'
import {ArrowLeft, Minus, Plus, RotateCcw, Settings2, Trophy, Users} from 'lucide-vue-next'
import type {ThemeColor} from '@/types'

defineOptions({name: 'DrawView'})

const gameStore = useGameStore()
const uiStore = useUiStore()

const {
  currentCategory,
  availableItems,
  wonItems,
  startDraw,
  confirmResetWinners,
  selectCategory,
} = useDraw()

const {mascotState} = useMascotState('draw')

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

const currentTheme = computed(() => {
  const color = currentCategory.value?.themeColor || 'cyan'
  return themeColorStyles[color]
})

const currentThemeColor = computed(() => currentCategory.value?.themeColor || 'cyan')

const adjustDrawCount = (delta: number) => {
  const newValue = Math.max(1, Math.min(100, uiStore.drawCount + delta))
  uiStore.setDrawCount(newValue)
}

const goBack = () => {
  uiStore.setView('setup')
}
</script>

<template>
  <div class="min-h-screen pt-1 md:pt-20 px-1 sm:px-6 pb-40 md:pb-8 animate-fade-in bg-night-deep">
    <!-- 动态背景光晕 -->
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
      <!-- MOBILE LAYOUT -->
      <!-- ========================================== -->
      <div class="lg:hidden flex flex-col">
        <!-- 顶部: 标题 + 抽取人数 + 统计 -->
        <header class="text-center mb-2 px-2">
          <h1 :class="[
            'text-2xl sm:text-3xl font-display font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r',
            currentTheme.gradient
          ]">
            {{ currentCategory?.name || '命运转盘' }}
          </h1>

          <!-- 抽取人数 + 统计 + 重置（紧凑单行） -->
          <div class="flex items-center justify-center gap-3 mt-2">
            <!-- 抽取人数 -->
            <div class="flex items-center gap-1">
              <button
                  :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center transition-all',
                  currentTheme.bg, currentTheme.border, 'border active:scale-90'
                ]"
                  @click="adjustDrawCount(-1)"
              >
                <Minus :class="['w-3 h-3', currentTheme.text]"/>
              </button>
              <span :class="['w-6 text-center font-mono font-bold text-sm', currentTheme.text]">
                {{ uiStore.drawCount }}
              </span>
              <button
                  :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center transition-all',
                  currentTheme.bg, currentTheme.border, 'border active:scale-90'
                ]"
                  @click="adjustDrawCount(1)"
              >
                <Plus :class="['w-3 h-3', currentTheme.text]"/>
              </button>
            </div>

            <span class="text-txt-muted/30">|</span>

            <!-- 统计 -->
            <span :class="['text-xs font-mono font-semibold flex items-center gap-1', currentTheme.text]">
              <Users class="w-3 h-3"/>{{ availableItems.length }}
            </span>
            <span class="text-xs text-accent-warm font-mono font-semibold flex items-center gap-1">
              <Trophy class="w-3 h-3"/>{{ wonItems.length }}
            </span>

            <span class="text-txt-muted/30">|</span>

            <!-- 重置 -->
            <button
                class="text-txt-muted/50 hover:text-accent-warm transition-colors"
                @click="confirmResetWinners"
            >
              <RotateCcw class="w-3.5 h-3.5"/>
            </button>
          </div>
        </header>

        <!-- 分组快速切换 -->
        <div
            v-if="gameStore.categories.length > 1"
            class="flex flex-wrap gap-1.5 justify-center px-2 py-1 mb-2"
        >
          <button
              v-for="category in gameStore.categories"
              :key="category.id"
              :class="[
              'px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200',
              gameStore.currentCategoryId === category.id
                ? [
                    themeColorStyles[category.themeColor].bg,
                    themeColorStyles[category.themeColor].text,
                    themeColorStyles[category.themeColor].border,
                    'border',
                    themeColorStyles[category.themeColor].glow
                  ]
                : 'bg-night-surface/30 text-txt-muted/70 border border-transparent'
            ]"
              @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- 待抽名单 -->
        <div class="px-2 mb-2">
          <ParticipantPool
              :items="currentCategory?.items || []"
              :theme-color="currentThemeColor"
              :is-spinning="uiStore.isSpinning"
              variant="mobile"
          />
        </div>

        <!-- 水车 -->
        <div class="flex justify-center my-2">
          <SlotMachine
              :items="availableItems"
              :theme-color="currentThemeColor"
          />
        </div>
      </div>

      <!-- ========================================== -->
      <!-- DESKTOP LAYOUT -->
      <!-- ========================================== -->
      <div class="hidden lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <!-- LEFT COLUMN -->
        <div class="lg:col-span-3 space-y-6">
          <div class="flex justify-center">
            <MascotReaction
                :state="mascotState"
                size="md"
                :show-bubble="true"
            />
          </div>

          <ParticipantPool
              :items="currentCategory?.items || []"
              :theme-color="currentThemeColor"
              :is-spinning="uiStore.isSpinning"
              variant="desktop"
          />

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
        </div>

        <!-- CENTER COLUMN -->
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

          <div class="mt-8 w-full max-w-md">
            <NCard variant="glass" padding="md">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <span :class="['text-sm font-medium', currentTheme.text]">抽取人数</span>
                  <NInput
                    v-model="uiStore.drawCount"
                    type="number"
                    :min="1"
                    :max="100"
                    size="md"
                    :mono="true"
                    class="w-20 text-center"
                    @update:model-value="(v) => uiStore.setDrawCount(Number(v))"
                  />
                </div>

                <NButton
                    variant="ghost"
                  size="sm"
                  @click="confirmResetWinners"
                >
                  <RotateCcw class="w-4 h-4"/>
                  重置状态
                </NButton>
              </div>

              <div class="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-glass-border">
                <div class="text-center">
                  <div :class="['text-2xl font-mono font-bold', currentTheme.text]">
                    {{ availableItems.length }}
                  </div>
                  <div class="text-xs text-txt-muted flex items-center gap-1">
                    <Users class="w-3 h-3"/>
                    待抽
                  </div>
                </div>
                <div class="w-px h-10 bg-glass-border"/>
                <div class="text-center">
                  <div class="text-2xl font-mono font-bold text-accent-warm">
                    {{ wonItems.length }}
                  </div>
                  <div class="text-xs text-txt-muted flex items-center gap-1">
                    <Trophy class="w-3 h-3"/>
                    已中奖
                  </div>
                </div>
              </div>
            </NCard>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="lg:col-span-3 h-auto lg:max-h-[80vh]">
          <DrawHistory/>
        </div>
      </div>
    </div>

    <!-- MOBILE BOTTOM BUTTON -->
    <div class="fixed bottom-16 left-0 right-0 z-30 lg:hidden">
      <div
          class="absolute inset-0 bg-gradient-to-t from-night-deep via-night-deep/90 to-transparent pointer-events-none"/>
      <div class="relative flex justify-center py-3">
        <NFateButton
          size="xl"
          :disabled="availableItems.length === 0"
          :loading="uiStore.isSpinning"
          @activate="startDraw"
        />
      </div>
    </div>
  </div>
</template>
