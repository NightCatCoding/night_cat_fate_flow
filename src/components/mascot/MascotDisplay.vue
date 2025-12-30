<script setup lang="ts">
import {computed} from 'vue'

interface Props {
  variant?: 'idle' | 'watching' | 'excited' | 'bored'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSpeech?: boolean
  speechText?: string
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'idle',
  size: 'md',
  showSpeech: false,
  speechText: '',
  animated: true,
})

const sizeClasses = computed(() => ({
  sm: 'w-24 h-24',
  md: 'w-40 h-40',
  lg: 'w-56 h-56',
  xl: 'w-72 h-72',
}[props.size]))

const eyeAnimation = computed(() => {
  if (!props.animated) return ''
  return props.variant === 'excited' ? 'animate-pulse-glow' : 'animate-eye-glow'
})

// Cat expressions based on variant
const eyeStyle = computed(() => ({
  idle: {lidHeight: '40%', pupilSize: '60%'},
  watching: {lidHeight: '20%', pupilSize: '70%'},
  excited: {lidHeight: '0%', pupilSize: '50%'},
  bored: {lidHeight: '60%', pupilSize: '80%'},
}[props.variant]))

const speeches = {
  idle: ['...又是无聊的一天', '快点开始吧...', '我在等呢...'],
  watching: ['有趣...', '让我看看...', '继续继续...'],
  excited: ['喵！', '这很刺激！', '命运之轮！'],
  bored: ['*打哈欠*', 'Zzz...', '随便吧...'],
}

const randomSpeech = computed(() => {
  if (props.speechText) return props.speechText
  const options = speeches[props.variant]
  return options[Math.floor(Math.random() * options.length)]
})
</script>

<template>
  <div class="relative inline-flex flex-col items-center">
    <!-- Speech Bubble -->
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 scale-95"
    >
      <div
          v-if="showSpeech"
          class="absolute -top-16 left-1/2 -translate-x-1/2 bg-night-surface border border-night-border rounded-2xl px-4 py-2 text-sm text-txt-secondary font-mono whitespace-nowrap shadow-cat-glow-subtle z-10"
      >
        {{ randomSpeech }}
        <!-- Speech bubble arrow -->
        <div
            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-night-surface"/>
      </div>
    </Transition>

    <!-- Cat Container -->
    <div
        :class="[
        'relative flex items-center justify-center',
        sizeClasses,
        animated && variant === 'idle' ? 'animate-float-slow' : '',
        animated && variant === 'bored' ? 'animate-pulse-subtle' : '',
      ]"
    >
      <!-- Glow Effect Background -->
      <div
          class="absolute inset-0 rounded-full bg-cat-eye/5 blur-3xl"
          :class="animated ? 'animate-pulse-subtle' : ''"
      />

      <!-- Cat SVG Illustration -->
      <svg
          viewBox="0 0 200 200"
          class="w-full h-full relative z-10"
          :class="animated ? 'drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]' : ''"
      >
        <!-- Cat Head Shape -->
        <ellipse
            cx="100"
            cy="110"
            rx="70"
            ry="60"
            class="fill-cat-fur stroke-cat-fur-light"
            stroke-width="1"
        />

        <!-- Left Ear -->
        <path
            d="M 35 75 L 50 30 L 75 70 Z"
            class="fill-cat-fur stroke-cat-fur-light"
            stroke-width="1"
        />
        <path
            d="M 42 70 L 52 40 L 68 65 Z"
            class="fill-cat-fur-dark"
        />

        <!-- Right Ear -->
        <path
            d="M 165 75 L 150 30 L 125 70 Z"
            class="fill-cat-fur stroke-cat-fur-light"
            stroke-width="1"
        />
        <path
            d="M 158 70 L 148 40 L 132 65 Z"
            class="fill-cat-fur-dark"
        />

        <!-- Face Details - Fur Pattern -->
        <ellipse
            cx="100"
            cy="115"
            rx="50"
            ry="40"
            class="fill-cat-fur-dark/50"
        />

        <!-- Left Eye Socket -->
        <ellipse
            cx="65"
            cy="100"
            rx="20"
            ry="22"
            class="fill-cat-fur-dark"
        />

        <!-- Right Eye Socket -->
        <ellipse
            cx="135"
            cy="100"
            rx="20"
            ry="22"
            class="fill-cat-fur-dark"
        />

        <!-- Left Eye (Glowing Cyan) -->
        <g :class="eyeAnimation">
          <ellipse
              cx="65"
              cy="100"
              rx="15"
              ry="17"
              class="fill-cat-eye"
              style="filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))"
          />
          <!-- Pupil -->
          <ellipse
              cx="65"
              cy="100"
              rx="5"
              :ry="parseInt(eyeStyle.pupilSize) * 0.17"
              class="fill-night-bg"
          />
          <!-- Eye Highlight -->
          <circle cx="60" cy="95" r="3" class="fill-white/80"/>
          <!-- Eyelid (for expressions) -->
          <rect
              x="48"
              y="78"
              width="34"
              :height="eyeStyle.lidHeight"
              class="fill-cat-fur transition-all duration-500"
              rx="2"
          />
        </g>

        <!-- Right Eye (Glowing Cyan) -->
        <g :class="eyeAnimation">
          <ellipse
              cx="135"
              cy="100"
              rx="15"
              ry="17"
              class="fill-cat-eye"
              style="filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))"
          />
          <!-- Pupil -->
          <ellipse
              cx="135"
              cy="100"
              rx="5"
              :ry="parseInt(eyeStyle.pupilSize) * 0.17"
              class="fill-night-bg"
          />
          <!-- Eye Highlight -->
          <circle cx="130" cy="95" r="3" class="fill-white/80"/>
          <!-- Eyelid -->
          <rect
              x="118"
              y="78"
              width="34"
              :height="eyeStyle.lidHeight"
              class="fill-cat-fur transition-all duration-500"
              rx="2"
          />
        </g>

        <!-- Nose -->
        <path
            d="M 95 125 L 100 130 L 105 125 Z"
            class="fill-cat-fur-light"
        />

        <!-- Mouth -->
        <path
            d="M 100 130 Q 100 135, 90 138"
            class="stroke-cat-fur-light fill-none"
            stroke-width="2"
            stroke-linecap="round"
        />
        <path
            d="M 100 130 Q 100 135, 110 138"
            class="stroke-cat-fur-light fill-none"
            stroke-width="2"
            stroke-linecap="round"
        />

        <!-- Whiskers Left -->
        <line x1="30" y1="115" x2="55" y2="118" class="stroke-cat-fur-light" stroke-width="1.5"/>
        <line x1="28" y1="125" x2="55" y2="125" class="stroke-cat-fur-light" stroke-width="1.5"/>
        <line x1="30" y1="135" x2="55" y2="132" class="stroke-cat-fur-light" stroke-width="1.5"/>

        <!-- Whiskers Right -->
        <line x1="170" y1="115" x2="145" y2="118" class="stroke-cat-fur-light" stroke-width="1.5"/>
        <line x1="172" y1="125" x2="145" y2="125" class="stroke-cat-fur-light" stroke-width="1.5"/>
        <line x1="170" y1="135" x2="145" y2="132" class="stroke-cat-fur-light" stroke-width="1.5"/>
      </svg>

      <!-- Animated particles around eyes when excited -->
      <template v-if="variant === 'excited' && animated">
        <div
            v-for="i in 6"
            :key="i"
            class="absolute w-1.5 h-1.5 rounded-full bg-cat-eye animate-ping"
            :style="{
            top: `${30 + Math.random() * 40}%`,
            left: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.5s',
          }"
        />
      </template>
    </div>
  </div>
</template>
