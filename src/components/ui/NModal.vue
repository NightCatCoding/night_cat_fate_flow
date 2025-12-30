<script setup lang="ts">
import {onMounted, onUnmounted, watch} from 'vue'
import {X} from 'lucide-vue-next'

defineOptions({name: 'NModal'})

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
  // New: Control modal style on mobile
  mobileStyle?: 'center' | 'bottom-sheet'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  mobileStyle: 'bottom-sheet',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClasses = {
  sm: 'md:max-w-md',
  md: 'md:max-w-lg',
  lg: 'md:max-w-2xl',
  xl: 'md:max-w-4xl',
  full: 'md:max-w-[95vw] max-h-[95vh]',
}

const close = () => {
  if (props.closable) {
    emit('update:modelValue', false)
  }
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue && props.closable) {
    close()
  }
}

// Lock body scroll when modal is open
watch(() => props.modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <!-- Backdrop - Mobile: tap to close near bottom, Desktop: standard -->
      <div
          v-if="modelValue"
          :class="[
            'fixed inset-0 z-50 bg-night-void/80 backdrop-blur-xl',
            mobileStyle === 'bottom-sheet'
              ? 'flex items-end md:items-center justify-center'
              : 'flex items-center justify-center p-4'
          ]"
          @click.self="handleOverlayClick"
      >
        <Transition
            enter-active-class="transition-all duration-300 ease-out"
            :enter-from-class="mobileStyle === 'bottom-sheet'
              ? 'opacity-0 translate-y-full md:translate-y-0 md:scale-95'
              : 'opacity-0 scale-95 translate-y-4'"
            enter-to-class="opacity-100 translate-y-0 md:scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            :leave-from-class="'opacity-100 translate-y-0 md:scale-100'"
            :leave-to-class="mobileStyle === 'bottom-sheet'
              ? 'opacity-0 translate-y-full md:translate-y-0 md:scale-95'
              : 'opacity-0 scale-95'"
        >
          <div
              v-if="modelValue"
              :class="[
              'w-full overflow-hidden',
              'bg-night-surface/95 backdrop-blur-2xl',
              'border border-glass-border',
              'shadow-glass-lg',
              sizeClasses[size],
              // Mobile: Bottom sheet style
              mobileStyle === 'bottom-sheet'
                ? 'rounded-t-4xl md:rounded-4xl max-h-[90vh] md:max-h-[85vh] md:mx-4'
                : 'rounded-4xl mx-4',
            ]"
          >
            <!-- Drag Handle - Mobile Bottom Sheet Only -->
            <div
                v-if="mobileStyle === 'bottom-sheet'"
                class="flex justify-center pt-3 pb-1 md:hidden"
            >
              <div class="w-12 h-1.5 rounded-full bg-night-muted/50"/>
            </div>

            <!-- Header -->
            <div
                v-if="title || closable"
                class="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b border-glass-border"
            >
              <h2 class="text-lg md:text-xl font-display font-bold text-txt-primary">
                {{ title }}
              </h2>
              <button
                  v-if="closable"
                  class="w-10 h-10 rounded-2xl flex items-center justify-center
                       text-txt-muted hover:text-cat-eye hover:bg-glass-white
                       transition-all duration-200 active:scale-95"
                  @click="close"
              >
                <X class="w-5 h-5"/>
              </button>
            </div>

            <!-- Body -->
            <div class="px-5 md:px-6 py-5 md:py-6 max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
              <slot/>
            </div>

            <!-- Footer -->
            <div
                v-if="$slots.footer"
                :class="[
                  'px-5 md:px-6 py-4 md:py-5 border-t border-glass-border bg-glass-white/50',
                  mobileStyle === 'bottom-sheet' ? 'safe-bottom' : ''
                ]"
            >
              <slot name="footer"/>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
