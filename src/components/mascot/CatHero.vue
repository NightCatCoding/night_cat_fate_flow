<script setup lang="ts">
import {computed, ref} from 'vue'

interface Props {
  imageSrc?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glowIntensity?: 'subtle' | 'normal' | 'strong'
  animated?: boolean
  showCaption?: boolean
  caption?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageSrc: '',
  size: 'md',
  glowIntensity: 'normal',
  animated: true,
  showCaption: false,
  caption: '',
})

const imageLoaded = ref(false)
const imageError = ref(false)

const sizeClasses = computed(() => ({
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
  xl: 'w-80 h-80',
}[props.size]))

const glowClasses = computed(() => ({
  subtle: 'shadow-cat-glow-subtle',
  normal: 'shadow-cat-glow',
  strong: 'shadow-cat-glow-strong',
}[props.glowIntensity]))

const captions = [
  '...万物皆可抽',
  '无聊的人类游戏',
  '让我看看谁是天选之人',
  '*不屑地看着轮盘*',
  '快点，我要打盹了',
]

const randomCaption = computed(() => {
  if (props.caption) return props.caption
  return captions[Math.floor(Math.random() * captions.length)]
})

const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  imageError.value = true
}
</script>

<template>
  <div class="relative inline-flex flex-col items-center">
    <!-- Caption -->
    <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
    >
      <div
          v-if="showCaption && imageLoaded"
          class="mb-4 px-6 py-3 bg-night-surface/90 backdrop-blur-sm border border-cat-eye/30 rounded-2xl shadow-cat-glow-subtle"
      >
        <p class="text-sm font-mono text-cat-eye italic">
          "{{ randomCaption }}"
        </p>
        <!-- Bubble pointer -->
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <div
              class="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-night-surface/90"/>
        </div>
      </div>
    </Transition>

    <!-- Image Container -->
    <div
        :class="[
        'relative overflow-hidden rounded-3xl',
        sizeClasses,
        glowClasses,
        animated ? 'animate-float-slow' : '',
      ]"
    >
      <!-- Glow backdrop -->
      <div
          class="absolute inset-0 bg-gradient-radial from-cat-eye/20 via-transparent to-transparent opacity-50"
          :class="animated ? 'animate-pulse-subtle' : ''"
      />

      <!-- Main Image -->
      <img
          v-if="imageSrc && !imageError"
          :src="imageSrc"
          alt="Night Cat"
          :class="[
          'w-full h-full object-cover transition-all duration-700',
          imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        ]"
          @load="handleImageLoad"
          @error="handleImageError"
      />

      <!-- Fallback SVG Cat if no image or error -->
      <div
          v-else
          class="w-full h-full flex items-center justify-center bg-night-surface"
      >
        <svg viewBox="0 0 100 100" class="w-3/4 h-3/4">
          <!-- Simple cat silhouette -->
          <ellipse cx="50" cy="55" rx="35" ry="30" class="fill-cat-fur"/>
          <!-- Ears -->
          <path d="M 20 40 L 28 15 L 40 35 Z" class="fill-cat-fur"/>
          <path d="M 80 40 L 72 15 L 60 35 Z" class="fill-cat-fur"/>
          <!-- Eyes -->
          <ellipse cx="38" cy="50" rx="8" ry="10" class="fill-cat-eye animate-eye-glow"/>
          <ellipse cx="62" cy="50" rx="8" ry="10" class="fill-cat-eye animate-eye-glow"/>
          <!-- Pupils -->
          <ellipse cx="38" cy="50" rx="3" ry="7" class="fill-night-bg"/>
          <ellipse cx="62" cy="50" rx="3" ry="7" class="fill-night-bg"/>
        </svg>
      </div>

      <!-- Overlay gradient for depth -->
      <div
          class="absolute inset-0 bg-gradient-to-t from-night-bg/40 via-transparent to-transparent pointer-events-none"/>

      <!-- Eye glow effect overlay -->
      <div
          class="absolute inset-0 pointer-events-none"
          :class="animated ? 'animate-pulse-subtle' : ''"
          style="background: radial-gradient(circle at 35% 40%, rgba(34, 211, 238, 0.15) 0%, transparent 30%),
               radial-gradient(circle at 65% 40%, rgba(34, 211, 238, 0.15) 0%, transparent 30%)"
      />
    </div>

    <!-- Decorative elements -->
    <div
        v-if="animated"
        class="absolute -z-10 inset-0 rounded-3xl"
        :class="[
        'bg-cat-eye/5 blur-2xl transform scale-110',
        'animate-pulse-glow'
      ]"
    />
  </div>
</template>
