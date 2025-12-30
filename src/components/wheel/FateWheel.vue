<script setup lang="ts">
import {computed, toRef} from 'vue'
import type {Item} from '@/types'
import {useGameStore, useUiStore} from '@/stores'
import {useWheel} from '@/composables'

defineOptions({name: 'FateWheel'})

interface Props {
  items: Item[]
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const gameStore = useGameStore()
const uiStore = useUiStore()

// 使用 useWheel composable 处理转盘逻辑
const {segments} = useWheel(toRef(props, 'items'))

// 计算转盘旋转样式
const wheelStyle = computed(() => {
  const durationMap = {slow: 7, normal: 5, fast: 3}
  const duration = durationMap[gameStore.settings.animationSpeed]

  return {
    transform: `rotate(${uiStore.rotation}deg)`,
    transition: uiStore.isSpinning
        ? `transform ${duration}s cubic-bezier(0.17, 0.67, 0.12, 0.99)`
        : 'none',
  }
})

// 尺寸类映射
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-[70vw] h-[70vw] max-w-[280px] max-h-[280px] sm:max-w-[320px] sm:max-h-[320px]'
    case 'lg':
      return 'w-[88vw] h-[88vw] max-w-[360px] max-h-[360px] sm:max-w-[400px] sm:max-h-[400px]'
    case 'xl':
      return 'w-[94vw] h-[94vw] max-w-[400px] max-h-[400px] sm:max-w-[440px] sm:max-h-[440px]'
    default: // md
      return 'w-[85vw] h-[85vw] max-w-[320px] max-h-[320px] sm:max-w-[380px] sm:max-h-[380px] md:w-[420px] md:h-[420px] md:max-w-[420px] md:max-h-[420px] lg:w-[460px] lg:h-[460px] lg:max-w-[460px] lg:max-h-[460px]'
  }
})
</script>

<template>
  <!-- RESPONSIVE WHEEL CONTAINER -->
  <div
      :class="[
      'relative mx-auto flex items-center justify-center',
      sizeClasses
    ]"
  >
    <!-- 外层光晕 - 旋转时更明亮 -->
    <div
        :class="[
        'absolute inset-[-15px] md:inset-[-20px] rounded-full blur-2xl md:blur-3xl transition-all duration-700',
        uiStore.isSpinning
          ? 'bg-gradient-to-r from-pink-500/30 via-violet-500/30 to-cyan-500/30 animate-pulse-soft'
          : 'bg-gradient-to-r from-pink-500/15 via-violet-500/15 to-cyan-500/15'
      ]"
    />

    <!-- 转盘容器 -->
    <div
        class="relative w-full h-full rounded-full overflow-hidden
             border-4 md:border-[6px] border-white/20
             shadow-[0_0_60px_rgba(139,92,246,0.3),0_0_100px_rgba(236,72,153,0.2)]"
        :style="wheelStyle"
    >
      <!-- SVG 转盘 -->
      <svg
          viewBox="0 0 100 100"
          class="w-full h-full transform -rotate-90"
      >
        <!-- 扇形區塊 -->
        <g v-for="segment in segments" :key="segment.id">
          <path
              :d="segment.path"
              :fill="segment.fillColor"
              stroke="#ffffff"
              stroke-width="0.5"
              class="transition-colors duration-300"
          />
          <!-- 文字帶陰影提高可讀性 -->
          <text
              :x="segment.textX"
              :y="segment.textY"
              :fill="segment.textColor"
              font-size="3.2"
              font-weight="700"
              text-anchor="middle"
              dominant-baseline="middle"
              :transform="`rotate(${segment.textRotation}, ${segment.textX}, ${segment.textY})`"
              class="select-none"
              style="font-family: 'Inter', sans-serif; text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
          >
            {{ segment.displayName }}
          </text>
        </g>

        <!-- 中心裝飾圈 -->
        <circle
            cx="50"
            cy="50"
            r="13"
            fill="#1e293b"
            stroke="#fbbf24"
            stroke-width="1.5"
        />
        <circle
            cx="50"
            cy="50"
            r="10"
            fill="#0f172a"
            stroke="#f59e0b"
            stroke-width="0.5"
        />
      </svg>
    </div>

    <!-- 中心 - 響應式尺寸 -->
    <div
        :class="[
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'w-16 h-16 sm:w-18 sm:h-18 md:w-24 md:h-24 rounded-full z-10',
        'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500',
        'border-4 md:border-[6px] border-white/30',
        'flex items-center justify-center',
        'shadow-[0_0_30px_rgba(251,191,36,0.5)]',
        uiStore.isSpinning ? 'animate-glow' : ''
      ]"
    >
    </div>

    <!-- 指針 - 更鮮豔的金色 -->
    <div class="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 z-20">
      <!-- 光暈效果 -->
      <div
          class="absolute inset-0 blur-lg opacity-70"
          style="border-left: 16px solid transparent; border-right: 16px solid transparent; border-top: 32px solid rgba(251, 191, 36, 0.6);"
      />
      <!-- Mobile 指針 -->
      <div
          class="w-0 h-0 md:hidden
               border-l-[12px] border-l-transparent
               border-r-[12px] border-r-transparent
               border-t-[24px] border-t-amber-400"
          style="filter: drop-shadow(0 4px 12px rgba(251,191,36,0.5))"
      />
      <!-- Desktop 指針 -->
      <div
          class="w-0 h-0 hidden md:block
               border-l-[16px] border-l-transparent
               border-r-[16px] border-r-transparent
               border-t-[32px] border-t-amber-400"
          style="filter: drop-shadow(0 4px 12px rgba(251,191,36,0.5))"
      />
    </div>

    <!-- 旋轉時的閃爍粒子 - 更多彩 -->
    <template v-if="uiStore.isSpinning">
      <div
          v-for="i in 8"
          :key="i"
          :class="[
          'absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-ping',
          i % 4 === 0 ? 'bg-pink-400' : i % 4 === 1 ? 'bg-violet-400' : i % 4 === 2 ? 'bg-cyan-400' : 'bg-amber-400'
        ]"
          :style="{
          top: `${50 + 44 * Math.sin((i * 45 * Math.PI) / 180)}%`,
          left: `${50 + 44 * Math.cos((i * 45 * Math.PI) / 180)}%`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: '0.8s',
        }"
      />
    </template>
  </div>
</template>
