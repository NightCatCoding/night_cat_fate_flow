<script setup lang="ts">
import {computed, nextTick, onMounted, ref, watch} from 'vue'
import type {Item, ThemeColor} from '@/types'
import {useGameStore, useUiStore} from '@/stores'

defineOptions({name: 'SlotMachine'})

interface Props {
  items: Item[]
  themeColor?: ThemeColor
}

const props = withDefaults(defineProps<Props>(), {
  themeColor: 'cyan'
})

const gameStore = useGameStore()
const uiStore = useUiStore()

// 主题颜色样式
const themeStyles: Record<ThemeColor, {
  text: string
  textHex: string
  bg: string
  border: string
  glow: string
  gradientFrom: string
  gradientTo: string
}> = {
  cyan: {
    text: 'text-cyan-400',
    textHex: '#22d3ee',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/50',
    glow: 'shadow-[0_0_40px_rgba(34,211,238,0.5)]',
    gradientFrom: 'from-cyan-500/20',
    gradientTo: 'to-teal-500/20'
  },
  blue: {
    text: 'text-blue-400',
    textHex: '#60a5fa',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/50',
    glow: 'shadow-[0_0_40px_rgba(59,130,246,0.5)]',
    gradientFrom: 'from-blue-500/20',
    gradientTo: 'to-indigo-500/20'
  },
  purple: {
    text: 'text-purple-400',
    textHex: '#c084fc',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/50',
    glow: 'shadow-[0_0_40px_rgba(168,85,247,0.5)]',
    gradientFrom: 'from-purple-500/20',
    gradientTo: 'to-violet-500/20'
  },
  pink: {
    text: 'text-pink-400',
    textHex: '#f472b6',
    bg: 'bg-pink-400/10',
    border: 'border-pink-400/50',
    glow: 'shadow-[0_0_40px_rgba(236,72,153,0.5)]',
    gradientFrom: 'from-pink-500/20',
    gradientTo: 'to-rose-500/20'
  },
  gold: {
    text: 'text-amber-400',
    textHex: '#fbbf24',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/50',
    glow: 'shadow-[0_0_40px_rgba(251,191,36,0.5)]',
    gradientFrom: 'from-amber-500/20',
    gradientTo: 'to-orange-500/20'
  },
  emerald: {
    text: 'text-emerald-400',
    textHex: '#34d399',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/50',
    glow: 'shadow-[0_0_40px_rgba(52,211,153,0.5)]',
    gradientFrom: 'from-emerald-500/20',
    gradientTo: 'to-green-500/20'
  }
}

const currentTheme = computed(() => themeStyles[props.themeColor])

// ============================================
// 核心配置
// ============================================
const ITEM_HEIGHT = 56 // 每个项目的高度 (px)
const VISIBLE_EXTRA = 3 // 框外上下各显示几个项目

// 中奖框高度 = 抽取人数 × 项目高度
const winnerBoxHeight = computed(() => {
  return uiStore.drawCount * ITEM_HEIGHT
})

// 容器总高度 = 中奖框 + 上下额外显示区域
const containerHeight = computed(() => {
  return winnerBoxHeight.value + (VISIBLE_EXTRA * 2 * ITEM_HEIGHT)
})

// ============================================
// 显示状态
// ============================================
const displayItems = ref<Item[]>([])
const isAnimating = ref(false)
const translateY = ref(0)
const transitionDuration = ref(0)

// 扩展的项目列表（用于滚动显示，确保循环效果）
const extendedItems = computed(() => {
  const sourceItems = displayItems.value.length > 0 ? displayItems.value : props.items
  if (sourceItems.length === 0) return []

  const result: Array<Item & { displayIndex: number }> = []
  const itemCount = sourceItems.length

  // 重复足够多次以支持滚动和初始显示
  const repeatCount = Math.max(20, Math.ceil(100 / itemCount))

  for (let r = 0; r < repeatCount; r++) {
    for (let i = 0; i < itemCount; i++) {
      result.push({
        ...sourceItems[i],
        displayIndex: r * itemCount + i
      })
    }
  }

  return result
})

// 计算初始偏移：让列表看起来是循环的（从中间开始，上下都有内容）
const getInitialOffset = () => {
  const sourceItems = displayItems.value.length > 0 ? displayItems.value : props.items
  if (sourceItems.length === 0) return 0

  // 从第5圈开始显示，确保上方有足够的内容
  const startRepeat = 5
  const itemCount = sourceItems.length
  const startIndex = startRepeat * itemCount

  // 容器中心点
  const containerCenter = containerHeight.value / 2
  // 框顶部位置
  const boxTop = containerCenter - winnerBoxHeight.value / 2

  // 让 startIndex 位置的项目对齐到框顶部
  return boxTop - (startIndex * ITEM_HEIGHT)
}

// ============================================
// 动画逻辑
// ============================================

// 监听旋转状态开始
watch(() => uiStore.isSpinning, (spinning) => {
  if (spinning && props.items.length > 0) {
    startSlotAnimation()
  }
})

// 开始水车滚动动画
const startSlotAnimation = async () => {
  if (props.items.length === 0) return

  // 🎯 重新排列：将中奖者放在列表开头
  const winnerIds = uiStore.pendingWinnerIds
  if (winnerIds.length > 0) {
    const winners: Item[] = []
    const others: Item[] = []

    props.items.forEach(item => {
      if (winnerIds.includes(item.id)) {
        winners.push(item)
      } else {
        others.push(item)
      }
    })

    // 确保中奖者顺序与 winnerIds 一致
    const sortedWinners = winnerIds
        .map(id => winners.find(w => w.id === id))
        .filter((w): w is Item => w !== undefined)

    // 中奖者放前面，其他人随机打乱放后面
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5)
    displayItems.value = [...sortedWinners, ...shuffledOthers]
  } else {
    displayItems.value = [...props.items]
  }

  isAnimating.value = true

  // 获取动画时长
  const duration = gameStore.settings.spinDuration

  // 计算滚动参数
  const itemCount = displayItems.value.length

  // 计算需要滚动的总距离
  // 至少转 4 圈，然后停在第一个位置（index 0 = 第一个中奖者）
  const minRotations = 4
  const totalItems = minRotations * itemCount
  const totalDistance = totalItems * ITEM_HEIGHT

  // 重置位置（无动画）
  transitionDuration.value = 0
  translateY.value = getInitialOffset()

  // 等待 DOM 更新
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 30))

  // 开始动画
  transitionDuration.value = duration
  translateY.value = getInitialOffset() - totalDistance

  // 动画结束后
  setTimeout(() => {
    isAnimating.value = false
    // ⚠️ 不清空 displayItems，保持显示状态直到下次开始或切换分组
  }, duration * 1000)
}

// 重置为初始状态
const resetToInitial = () => {
  displayItems.value = props.items.length > 0 ? [...props.items] : []
  transitionDuration.value = 0
  translateY.value = getInitialOffset()
}

// 初始化
onMounted(() => {
  resetToInitial()
})

// 监听分组切换（items 完全变化时）- 立即重置
watch(() => gameStore.currentCategoryId, () => {
  if (!isAnimating.value) {
    resetToInitial()
  }
})

// 监听 items 变化（非动画状态且 displayItems 为空时同步）
watch(() => props.items, (newItems) => {
  // 如果正在动画，不更新
  if (isAnimating.value) return

  // 如果 displayItems 为空，或者 items 数量变化（可能是分组切换），重置
  if (displayItems.value.length === 0 || newItems.length !== displayItems.value.length) {
    resetToInitial()
  }
}, {deep: true})

// 监听 drawCount 变化时更新布局（非动画状态）
watch(() => uiStore.drawCount, () => {
  if (!isAnimating.value) {
    transitionDuration.value = 0
    translateY.value = getInitialOffset()
  }
})
</script>

<template>
  <div class="slot-machine-wrapper w-full max-w-md mx-auto px-2">
    <!-- 水车主体 -->
    <div
        :class="[
        'relative rounded-3xl overflow-hidden border-2 transition-all duration-500',
        currentTheme.border,
        isAnimating ? [currentTheme.glow, 'scale-[1.02]'] : ''
      ]"
        :style="{ height: containerHeight + 'px' }"
    >
      <!-- 背景渐变 -->
      <div
          :class="['absolute inset-0 bg-gradient-to-b', currentTheme.gradientFrom, 'via-transparent', currentTheme.gradientTo]"/>

      <!-- 装饰光条（动画时） -->
      <div
          v-if="isAnimating"
          class="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5 animate-pulse"
      />

      <!-- 滚动区域 -->
      <div class="relative w-full h-full overflow-hidden">
        <!-- 项目轨道 -->
        <div
            v-if="extendedItems.length > 0"
            class="absolute left-0 right-0 flex flex-col items-center"
            :style="{
            transform: `translateY(${translateY}px)`,
            transition: transitionDuration > 0 
              ? `transform ${transitionDuration}s cubic-bezier(0.12, 0.8, 0.2, 1)` 
              : 'none'
          }"
        >
          <div
              v-for="item in extendedItems"
              :key="`${item.id}-${item.displayIndex}`"
              class="flex items-center justify-center w-full shrink-0"
              :style="{ height: ITEM_HEIGHT + 'px' }"
          >
            <span
                class="font-display font-bold text-center truncate text-xl md:text-2xl text-txt-secondary/80 px-4"
                style="width: 80%;"
            >
              {{ item.name }}
            </span>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-txt-muted/50">
          <div class="text-5xl mb-3">🎰</div>
          <p class="text-sm font-medium">暂无参与者</p>
        </div>

        <!-- 上方渐变遮罩 -->
        <div
            class="absolute top-0 left-0 right-0 z-10 pointer-events-none bg-gradient-to-b from-night-deep via-night-deep/65 to-transparent"
            :style="{ height: (VISIBLE_EXTRA * ITEM_HEIGHT) + 'px' }"
        />

        <!-- 下方渐变遮罩 -->
        <div
            class="absolute bottom-0 left-0 right-0 z-10 pointer-events-none bg-gradient-to-t from-night-deep via-night-deep/65 to-transparent"
            :style="{ height: (VISIBLE_EXTRA * ITEM_HEIGHT) + 'px' }"
        />

        <!-- 中奖框 - 精确高度 = drawCount × ITEM_HEIGHT -->
        <div
            :class="[
            'absolute left-3 right-3 border-2 rounded-2xl z-20 pointer-events-none transition-all duration-500',
            currentTheme.border,
            isAnimating ? 'animate-pulse' : ''
          ]"
            :style="{
            height: winnerBoxHeight + 'px',
            top: '50%',
            transform: 'translateY(-50%)',
            boxShadow: isAnimating ? `inset 0 0 30px ${currentTheme.textHex}25, 0 0 20px ${currentTheme.textHex}30` : 'none'
          }"
        >
          <!-- 中奖框内部高光 -->
          <div
              :class="[
              'absolute inset-0 rounded-xl transition-opacity duration-300',
              currentTheme.bg,
              isAnimating ? 'opacity-50' : 'opacity-20'
            ]"
          />

          <!-- 左箭头 -->
          <div
              class="absolute -left-4 top-1/2 -translate-y-1/2 transition-transform duration-300"
              :class="{ 'scale-125': isAnimating }"
          >
            <div
                class="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[14px]"
                :style="{ borderRightColor: currentTheme.textHex }"
            />
          </div>

          <!-- 右箭头 -->
          <div
              class="absolute -right-4 top-1/2 -translate-y-1/2 transition-transform duration-300"
              :class="{ 'scale-125': isAnimating }"
          >
            <div
                class="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[14px]"
                :style="{ borderLeftColor: currentTheme.textHex }"
            />
          </div>

          <!-- 抽取人数指示 (多人时显示) -->
          <div
              v-if="uiStore.drawCount > 1"
              :class="[
              'absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap',
              currentTheme.bg, currentTheme.text, 'border', currentTheme.border
            ]"
          >
            抽 {{ uiStore.drawCount }} 人
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slot-machine-wrapper {
  perspective: 1000px;
}

@keyframes blink {
  0% {
    opacity: 0.3;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>
