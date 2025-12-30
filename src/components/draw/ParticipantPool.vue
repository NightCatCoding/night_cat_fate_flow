<script setup lang="ts">
/**
 * 待抽名单组件
 *
 * 心理学设计原则：
 * 1. 预期效应 - 展示所有候选人，产生"谁会中奖"的悬念
 * 2. 参与感 - 名字醒目显示，增加观众投入度
 * 3. 公平性 - 透明展示增加可信度
 * 4. 紧张感 - 抽奖时的视觉效果增强刺激
 */
import {computed, ref} from 'vue'
import {ChevronDown, ChevronUp, Sparkles, Users} from 'lucide-vue-next'
import type {Item, ThemeColor} from '@/types'

defineOptions({name: 'ParticipantPool'})

interface Props {
  items: Item[]
  themeColor?: ThemeColor
  isSpinning?: boolean
  variant?: 'desktop' | 'mobile'
}

const props = withDefaults(defineProps<Props>(), {
  themeColor: 'cyan',
  isSpinning: false,
  variant: 'desktop'
})

// 手机版展开状态
const isExpanded = ref(false)

// 主题颜色样式
const themeStyles: Record<ThemeColor, {
  text: string
  textHex: string
  bg: string
  border: string
  gradient: string
  glow: string
}> = {
  cyan: {
    text: 'text-cyan-400',
    textHex: '#22d3ee',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/30',
    gradient: 'from-cyan-400 to-teal-400',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]'
  },
  blue: {
    text: 'text-blue-400',
    textHex: '#60a5fa',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
    gradient: 'from-blue-400 to-indigo-400',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
  },
  purple: {
    text: 'text-purple-400',
    textHex: '#c084fc',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/30',
    gradient: 'from-purple-400 to-violet-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'
  },
  pink: {
    text: 'text-pink-400',
    textHex: '#f472b6',
    bg: 'bg-pink-400/10',
    border: 'border-pink-400/30',
    gradient: 'from-pink-400 to-rose-400',
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]'
  },
  gold: {
    text: 'text-amber-400',
    textHex: '#fbbf24',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    gradient: 'from-amber-400 to-orange-400',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]'
  },
  emerald: {
    text: 'text-emerald-400',
    textHex: '#34d399',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    gradient: 'from-emerald-400 to-green-400',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]'
  }
}

const theme = computed(() => themeStyles[props.themeColor])

// 待抽选的项目（未中奖）
const availableItems = computed(() => props.items.filter(i => !i.hasWon))

// 已中奖的项目
const wonItems = computed(() => props.items.filter(i => i.hasWon))

// 手机版：默认显示的数量
const MOBILE_PREVIEW_COUNT = 8

// 手机版预览项目
const previewItems = computed(() => {
  if (props.variant === 'mobile' && !isExpanded.value) {
    return availableItems.value.slice(0, MOBILE_PREVIEW_COUNT)
  }
  return availableItems.value
})

// 是否有更多项目
const hasMore = computed(() =>
    props.variant === 'mobile' &&
    availableItems.value.length > MOBILE_PREVIEW_COUNT
)

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <!-- ========================================== -->
  <!-- 电脑版：完整卡片式名单 -->
  <!-- ========================================== -->
  <div
      v-if="variant === 'desktop'"
      :class="[
      'rounded-3xl border backdrop-blur-sm transition-all duration-500 overflow-hidden',
      theme.border,
      theme.bg,
      isSpinning ? [theme.glow, 'scale-[1.01]'] : ''
    ]"
  >
    <!-- 标题栏 -->
    <div :class="[
      'px-5 py-4 border-b flex items-center justify-between',
      theme.border
    ]">
      <div class="flex items-center gap-3">
        <div :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
          theme.bg,
          isSpinning ? 'animate-pulse' : ''
        ]">
          <Users :class="['w-5 h-5', theme.text]"/>
        </div>
        <div>
          <h3 :class="['font-semibold text-base', theme.text]">待抽名单</h3>
          <p class="text-xs text-txt-muted">等待命运裁决</p>
        </div>
      </div>

      <!-- 人数统计 -->
      <div :class="[
        'px-4 py-2 rounded-full font-mono font-bold text-lg',
        theme.bg, theme.text,
        isSpinning ? 'animate-pulse' : ''
      ]">
        {{ availableItems.length }}
        <span class="text-xs font-normal text-txt-muted ml-1">人</span>
      </div>
    </div>

    <!-- 名单区域 -->
    <div class="p-4 max-h-[280px] overflow-y-auto custom-scrollbar">
      <!-- 空状态 -->
      <div
          v-if="availableItems.length === 0"
          class="text-center py-8 text-txt-muted"
      >
        <Sparkles class="w-10 h-10 mx-auto mb-3 opacity-30"/>
        <p class="font-medium">全部抽完啦！</p>
        <p class="text-xs mt-1 opacity-70">可以重置状态再来一轮</p>
      </div>

      <!-- 名单网格 -->
      <div v-else class="grid grid-cols-2 gap-2">
        <div
            v-for="(item, index) in availableItems"
            :key="item.id"
            :class="[
            'relative px-3 py-2.5 rounded-xl text-center font-mono text-sm font-medium transition-all duration-300',
            'bg-night-surface/50 border',
            theme.border,
            theme.text,
            isSpinning ? 'participant-pulse' : 'hover:scale-105 hover:bg-night-surface'
          ]"
            :style="{
            animationDelay: isSpinning ? `${(index % 10) * 50}ms` : '0ms'
          }"
        >
          <!-- 序号标记 -->
          <span
              class="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-night-deep text-[10px] flex items-center justify-center text-txt-muted border border-night-muted">
            {{ index + 1 }}
          </span>

          <span class="truncate block">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 已中奖区域（如果有） -->
    <div
        v-if="wonItems.length > 0"
        class="px-4 pb-4 pt-2 border-t border-night-muted/30"
    >
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs text-txt-muted/60">已中奖</span>
        <span class="text-xs font-mono text-accent-warm/60">{{ wonItems.length }}人</span>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <span
            v-for="item in wonItems"
            :key="item.id"
            class="px-2 py-1 rounded-lg text-xs font-mono bg-night-surface/30 text-txt-muted/40 line-through"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- 手机版：紧凑可展开名单 -->
  <!-- ========================================== -->
  <div
      v-else
      :class="[
      'rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden',
      theme.border,
      theme.bg,
      isSpinning ? theme.glow : ''
    ]"
  >
    <!-- 可点击的标题栏 -->
    <button
        class="w-full px-4 py-3 flex items-center justify-between"
        @click="toggleExpand"
    >
      <div class="flex items-center gap-2">
        <Users :class="['w-4 h-4', theme.text, isSpinning ? 'animate-pulse' : '']"/>
        <span :class="['font-semibold text-sm', theme.text]">待抽名单</span>
        <span :class="[
          'px-2 py-0.5 rounded-full text-xs font-mono font-bold',
          theme.bg, theme.text
        ]">
          {{ availableItems.length }}人
        </span>
      </div>

      <component
          :is="isExpanded ? ChevronUp : ChevronDown"
          :class="['w-4 h-4 text-txt-muted transition-transform duration-300', isExpanded ? '' : '']"
      />
    </button>

    <!-- 名单内容 -->
    <div
        :class="[
        'overflow-hidden transition-all duration-300',
        isExpanded ? 'max-h-[50vh]' : 'max-h-[120px]'
      ]"
    >
      <div class="px-3 pb-3">
        <!-- 空状态 -->
        <div
            v-if="availableItems.length === 0"
            class="text-center py-4 text-txt-muted"
        >
          <p class="text-sm">全部抽完啦！</p>
        </div>

        <!-- 名单标签流 -->
        <div
            v-else
            :class="[
            'flex flex-wrap gap-1.5',
            isExpanded ? 'overflow-y-auto max-h-[45vh] py-1' : ''
          ]"
        >
          <span
              v-for="(item, index) in previewItems"
              :key="item.id"
              :class="[
              'px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200',
              'bg-night-surface/60 border',
              theme.border, theme.text,
              isSpinning ? 'animate-pulse' : ''
            ]"
              :style="{ animationDelay: isSpinning ? `${(index % 8) * 60}ms` : '0ms' }"
          >
            {{ item.name }}
          </span>

          <!-- 展开更多按钮 -->
          <button
              v-if="hasMore && !isExpanded"
              :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              'bg-night-surface/80 text-txt-muted hover:text-txt-secondary'
            ]"
              @click.stop="toggleExpand"
          >
            +{{ availableItems.length - MOBILE_PREVIEW_COUNT }} 更多
          </button>
        </div>

        <!-- 已中奖（收起时不显示） -->
        <div
            v-if="wonItems.length > 0 && isExpanded"
            class="mt-3 pt-3 border-t border-night-muted/20"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[10px] text-txt-muted/50">已中奖 {{ wonItems.length }}人</span>
          </div>
          <div class="flex flex-wrap gap-1">
            <span
                v-for="item in wonItems"
                :key="item.id"
                class="px-2 py-0.5 rounded text-[10px] font-mono bg-night-surface/20 text-txt-muted/30 line-through"
            >
              {{ item.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 抽奖时的脉冲动画 */
@keyframes participant-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

.participant-pulse {
  animation: participant-pulse 0.8s ease-in-out infinite;
}
</style>
