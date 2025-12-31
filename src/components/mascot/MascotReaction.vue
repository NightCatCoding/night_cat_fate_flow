<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue'
import defaultMascot from '@/assets/pray.png'

type MascotState = 'idle' | 'waiting' | 'spinning' | 'winner' | 'empty' | 'sleeping'

interface Props {
  state?: MascotState
  customMessage?: string
  size?: 'sm' | 'md' | 'lg'
  showBubble?: boolean
  imageSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  state: 'idle',
  customMessage: '',
  size: 'md',
  showBubble: true,
  imageSrc: defaultMascot,
})

// Cynical speech lines per state
const SPEECHES: Record<MascotState, string[]> = {
  idle: [
    '...又是一天',
    '快点开始吧',
    '*打哈欠*',
    '无聊死了',
    '随便吧...',
    '我在等呢',
  ],
  waiting: [
    '还没好吗？',
    '加点人进去',
    '空的...跟我的心一样',
    '需要帮忙吗？...算了',
    '总得有人参加吧',
  ],
  spinning: [
    '转啊转...',
    '缘分在旋转',
    '有点晕...',
    '谁会中奖呢',
    '*看着轮盘*',
    '快了快了...',
  ],
  winner: [
    '恭喜...我猜',
    '终于结束了',
    '天选之人诞生',
    '运气不错嘛',
    '可以了吧？',
    '*鼓掌* 好了',
  ],
  empty: [
    '没人了...',
    '都抽完了？',
    '空空如也',
    '*crickets*',
    '下一轮？',
  ],
  sleeping: [
    'Zzz...',
    '*呼噜*',
    '...嗯？',
    '*眯眼*',
  ],
}

const MESSAGE_CYCLE_INTERVAL = 8000

const currentMessage = ref('')
const showMessage = ref(false)
const messageKey = ref(0)
let messageCycleTimer: ReturnType<typeof setInterval> | null = null

// Get random message for current state
const getRandomMessage = (): string => {
  if (props.customMessage) return props.customMessage
  const options = SPEECHES[props.state]
  return options[Math.floor(Math.random() * options.length)]
}

// Update message display with animation
const updateMessage = () => {
  showMessage.value = false
  setTimeout(() => {
    currentMessage.value = getRandomMessage()
    messageKey.value++
    showMessage.value = true
  }, 200)
}

// Update message when state changes
watch(() => props.state, updateMessage, {immediate: true})

// Cycle messages occasionally for idle states
onMounted(() => {
  if (props.showBubble) {
    messageCycleTimer = setInterval(() => {
      if (props.state === 'idle' || props.state === 'waiting') {
        showMessage.value = false
        setTimeout(() => {
          currentMessage.value = getRandomMessage()
          messageKey.value++
          showMessage.value = true
        }, 300)
      }
    }, MESSAGE_CYCLE_INTERVAL)
  }
})

// Clean up timer to prevent memory leaks
onUnmounted(() => {
  if (messageCycleTimer) {
    clearInterval(messageCycleTimer)
    messageCycleTimer = null
  }
})

// 尺寸配置 - 手机版更大更醒目
const sizeClasses = computed(() => ({
  // sm: 手机32vw(最大120px), 平板28, 桌面32
  sm: 'w-[32vw] h-[32vw] max-w-[120px] max-h-[120px] sm:w-28 sm:h-28 sm:max-w-none sm:max-h-none md:w-32 md:h-32',
  // md: 手机38vw(最大150px), 平板36, 桌面44
  md: 'w-[38vw] h-[38vw] max-w-[150px] max-h-[150px] sm:w-36 sm:h-36 sm:max-w-none sm:max-h-none md:w-44 md:h-44',
  // lg: 手机44vw(最大180px), 平板44, 桌面56
  lg: 'w-[44vw] h-[44vw] max-w-[180px] max-h-[180px] sm:w-44 sm:h-44 sm:max-w-none sm:max-h-none md:w-56 md:h-56',
}[props.size]))

const bubblePosition = computed(() => ({
  sm: '-top-12 -right-2',
  md: '-top-14 -right-4',
  lg: '-top-16 -right-6',
}[props.size]))

// Eye states based on mood
const eyeState = computed(() => ({
  idle: {lidHeight: 45, pupilScale: 1},
  waiting: {lidHeight: 30, pupilScale: 1.1},
  spinning: {lidHeight: 10, pupilScale: 0.8},
  winner: {lidHeight: 20, pupilScale: 0.9},
  empty: {lidHeight: 55, pupilScale: 1},
  sleeping: {lidHeight: 85, pupilScale: 1},
}[props.state]))
</script>

<template>
  <div class="relative inline-flex flex-col items-center select-none">
    <!-- Speech Bubble -->
    <Transition
        enter-active-class="animate-speech-pop"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
    >
      <div
          v-if="showBubble && showMessage"
          :key="messageKey"
          :class="[
          'absolute z-20 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap',
          'bg-glass-white backdrop-blur-xl border border-glass-border',
          'text-txt-secondary shadow-glass',
          bubblePosition
        ]"
      >
        <span class="font-mono text-cat-eye/90">{{ currentMessage }}</span>

        <!-- Bubble tail -->
        <div
            class="absolute -bottom-2 left-6 w-4 h-4 rotate-45
                 bg-glass-white border-r border-b border-glass-border"
        />
      </div>
    </Transition>

    <!-- Cat Container -->
    <div
        :class="[
        'relative',
        sizeClasses,
        state === 'spinning' ? 'animate-wiggle' : 'animate-float-lazy',
      ]"
    >

      <!-- Image slot or SVG Cat -->
      <img
          v-if="imageSrc"
          :src="imageSrc"
          alt="Night Cat"
          class="w-full h-full object-cover relative z-10"
      />

      <!-- Fallback SVG Cat -->
      <svg
          v-else
          viewBox="0 0 100 100"
          class="w-full h-full p-3 relative z-10"
      >
        <!-- Cat head -->
        <ellipse
            cx="50" cy="55" rx="32" ry="28"
            class="fill-cat-fur stroke-cat-fur-light/50"
            stroke-width="0.5"
        />

        <!-- Ears -->
        <path d="M 22 38 L 28 15 L 40 33 Z" class="fill-cat-fur"/>
        <path d="M 78 38 L 72 15 L 60 33 Z" class="fill-cat-fur"/>
        <path d="M 26 35 L 30 22 L 38 32 Z" class="fill-cat-fur-dark/60"/>
        <path d="M 74 35 L 70 22 L 62 32 Z" class="fill-cat-fur-dark/60"/>

        <!-- Face shadow -->
        <ellipse cx="50" cy="58" rx="22" ry="18" class="fill-cat-fur-dark/40"/>

        <!-- Left Eye -->
        <g class="transition-all duration-300">
          <!-- Eye white/glow -->
          <ellipse
              cx="38" cy="50" rx="10" ry="12"
              class="fill-cat-eye/90"
              :style="`filter: drop-shadow(0 0 8px rgba(45, 212, 191, 0.6))`"
          />
          <!-- Pupil -->
          <ellipse
              cx="38" cy="50"
              :rx="3 * eyeState.pupilScale"
              :ry="8 * eyeState.pupilScale"
              class="fill-night-void transition-all duration-300"
          />
          <!-- Highlight -->
          <circle cx="35" cy="46" r="2" class="fill-white/70"/>
          <!-- Eyelid -->
          <rect
              x="26" y="36" width="24"
              :height="eyeState.lidHeight + '%'"
              class="fill-cat-fur transition-all duration-500"
              rx="2"
          />
        </g>

        <!-- Right Eye -->
        <g class="transition-all duration-300">
          <ellipse
              cx="62" cy="50" rx="10" ry="12"
              class="fill-cat-eye/90"
              :style="`filter: drop-shadow(0 0 8px rgba(45, 212, 191, 0.6))`"
          />
          <ellipse
              cx="62" cy="50"
              :rx="3 * eyeState.pupilScale"
              :ry="8 * eyeState.pupilScale"
              class="fill-night-void transition-all duration-300"
          />
          <circle cx="59" cy="46" r="2" class="fill-white/70"/>
          <rect
              x="50" y="36" width="24"
              :height="eyeState.lidHeight + '%'"
              class="fill-cat-fur transition-all duration-500"
              rx="2"
          />
        </g>

        <!-- Nose -->
        <path d="M 47 66 L 50 70 L 53 66 Z" class="fill-cat-fur-light/80"/>

        <!-- Mouth -->
        <path
            d="M 50 70 Q 50 74, 42 76"
            class="stroke-cat-fur-light/60 fill-none"
            stroke-width="1.5"
            stroke-linecap="round"
        />
        <path
            d="M 50 70 Q 50 74, 58 76"
            class="stroke-cat-fur-light/60 fill-none"
            stroke-width="1.5"
            stroke-linecap="round"
        />

        <!-- Whiskers -->
        <g class="stroke-cat-fur-light/50" stroke-width="1" stroke-linecap="round">
          <line x1="15" y1="58" x2="32" y2="60"/>
          <line x1="14" y1="65" x2="32" y2="66"/>
          <line x1="16" y1="72" x2="32" y2="70"/>
          <line x1="85" y1="58" x2="68" y2="60"/>
          <line x1="86" y1="65" x2="68" y2="66"/>
          <line x1="84" y1="72" x2="68" y2="70"/>
        </g>
      </svg>
    </div>
  </div>
</template>
