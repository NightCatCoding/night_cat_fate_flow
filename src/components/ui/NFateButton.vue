<script setup lang="ts">
import {computed, ref} from 'vue'
// 导入图片资源
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
// 尺寸配置 - 手机版显著放大
// ============================================
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-28 h-28 sm:w-24 sm:h-24 md:w-28 md:h-28'
    case 'md':
      return 'w-36 h-36 sm:w-32 sm:h-32 md:w-40 md:h-40'
    case 'xl':
      // 手机版非常大: 48vw，最大200px
      return 'w-[48vw] h-[48vw] max-w-[200px] max-h-[200px] sm:w-52 sm:h-52 sm:max-w-none sm:max-h-none md:w-56 md:h-56'
    case 'lg':
    default:
      // 手机版大: 44vw，最大180px
      return 'w-[44vw] h-[44vw] max-w-[180px] max-h-[180px] sm:w-48 sm:h-48 sm:max-w-none sm:max-h-none md:w-52 md:h-52 lg:w-56 lg:h-56'
  }
})

// ============================================
// 交互状态管理
// ============================================
const isHovering = ref(false)
const isPressing = ref(false)

// 当前显示的图片
const currentImage = computed(() => {
  if (props.loading) return pushImg
  if (isPressing.value) return pushImg
  if (isHovering.value) return pushImg
  return standbyImg
})

// 按钮缩放样式
const buttonScale = computed(() => {
  if (props.disabled) return 'scale-100 opacity-50'
  if (props.loading) return 'scale-95 animate-pulse'
  if (isPressing.value) return 'scale-90'
  if (isHovering.value) return 'scale-110'
  return 'scale-100'
})

// ============================================
// 鼠标事件处理
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
    // 放开鼠标时才触发
    emit('activate')
  }
}

// ============================================
// 触控事件处理（移动端）
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
    <!-- 外发光效果 -->
    <div
        :class="[
        'absolute inset-0 rounded-full blur-2xl transition-all duration-500',
        isHovering && !disabled ? 'bg-cat-eye/40 scale-125' : 'bg-cat-eye/20 scale-100',
        loading ? 'animate-pulse bg-cat-eye/50' : ''
      ]"
    />

    <!-- 按钮图片容器 -->
    <div
        :class="[
        'relative transition-all duration-200 ease-out',
        buttonScale
      ]"
    >
      <!-- 主图片 -->
      <img
          :src="currentImage"
          alt="开始抽选"
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
  /* 移除默认按钮样式 */
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.fate-button:disabled {
  cursor: not-allowed;
}

/* 确保图片不会被拖动 */
.fate-button img {
  pointer-events: none;
  user-select: none;
}
</style>
