<script setup lang="ts">
import {computed, ref} from 'vue'
// 導入圖片資源
import standbyImg from '@/assets/standby_fate_flow.png'
import pushImg from '@/assets/push_fate_flow.png'

defineOptions({name: 'NFateButton'})

interface Props {
  disabled?: boolean
  loading?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  size: 'lg',
})

const emit = defineEmits<{
  activate: []
}>()

// ============================================
// 尺寸配置
// ============================================
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-20 h-20 sm:w-24 sm:h-24'
    case 'md':
      return 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36'
    case 'xl':
      return 'w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52'
    case 'lg':
    default:
      return 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56'
  }
})

// ============================================
// 交互狀態管理
// ============================================
const isHovering = ref(false)
const isPressing = ref(false)

// 當前顯示的圖片
const currentImage = computed(() => {
  if (props.loading) return pushImg
  if (isPressing.value) return pushImg
  if (isHovering.value) return pushImg
  return standbyImg
})

// 按鈕縮放樣式
const buttonScale = computed(() => {
  if (props.disabled) return 'scale-100 opacity-50'
  if (props.loading) return 'scale-95 animate-pulse'
  if (isPressing.value) return 'scale-90'
  if (isHovering.value) return 'scale-110'
  return 'scale-100'
})

// ============================================
// 滑鼠事件處理
// ============================================
const handleMouseEnter = () => {
  if (!props.disabled && !props.loading) {
    isHovering.value = true
  }
}

const handleMouseLeave = () => {
  isHovering.value = false
  isPressing.value = false
}

const handleMouseDown = () => {
  if (!props.disabled && !props.loading) {
    isPressing.value = true
  }
}

const handleMouseUp = () => {
  if (isPressing.value && !props.disabled && !props.loading) {
    isPressing.value = false
    // 放開滑鼠時才觸發
    emit('activate')
  }
}

// ============================================
// 觸控事件處理（移動端）
// ============================================
const handleTouchStart = () => {
  if (!props.disabled && !props.loading) {
    isHovering.value = true
    isPressing.value = true
  }
}

const handleTouchEnd = () => {
  if (isPressing.value && !props.disabled && !props.loading) {
    isPressing.value = false
    isHovering.value = false
    emit('activate')
  }
}

const handleTouchCancel = () => {
  isPressing.value = false
  isHovering.value = false
}
</script>

<template>
  <button
      type="button"
      class="fate-button group relative select-none outline-none focus:outline-none"
      :disabled="disabled || loading"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousedown.prevent="handleMouseDown"
      @mouseup="handleMouseUp"
      @touchstart.prevent="handleTouchStart"
      @touchend.prevent="handleTouchEnd"
      @touchcancel="handleTouchCancel"
  >
    <!-- 外發光效果 -->
    <div
        :class="[
        'absolute inset-0 rounded-full blur-2xl transition-all duration-500',
        isHovering && !disabled ? 'bg-cat-eye/40 scale-125' : 'bg-cat-eye/20 scale-100',
        loading ? 'animate-pulse bg-cat-eye/50' : ''
      ]"
    />

    <!-- 按鈕圖片容器 -->
    <div
        :class="[
        'relative transition-all duration-200 ease-out',
        buttonScale
      ]"
    >
      <!-- 主圖片 -->
      <img
          :src="currentImage"
          alt="開啟命運"
          :class="[
          sizeClasses,
          'object-contain drop-shadow-2xl transition-all duration-200',
          isHovering && !disabled ? 'drop-shadow-[0_0_30px_rgba(45,212,191,0.6)]' : 'drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]'
        ]"
          draggable="false"
      />
    </div>
  </button>
</template>

<style scoped>
.fate-button {
  /* 移除默認按鈕樣式 */
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.fate-button:disabled {
  cursor: not-allowed;
}

/* 確保圖片不會被拖動 */
.fate-button img {
  pointer-events: none;
  user-select: none;
}
</style>
