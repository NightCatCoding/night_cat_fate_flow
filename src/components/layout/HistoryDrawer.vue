<script setup lang="ts">
import {watch} from 'vue'
import {DrawHistory} from '@/components/history'
import {X} from 'lucide-vue-next'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => {
  emit('update:modelValue', false)
}

// Lock body scroll when drawer is open
watch(() => props.modelValue, (open) => {
  if (open) {
    document.body.classList.add('drawer-open')
  } else {
    document.body.classList.remove('drawer-open')
  }
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="modelValue"
          class="fixed inset-0 z-50 bg-night-void/70 backdrop-blur-sm"
          @click="close"
      />
    </Transition>

    <!-- Drawer Panel - Slides up from bottom ("Lazy" principle: close is at bottom) -->
    <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
    >
      <div
          v-if="modelValue"
          class="fixed bottom-0 left-0 right-0 z-50 
                 max-h-[85vh] h-[85vh]
                 bg-night-surface rounded-t-4xl
                 border-t border-glass-border
                 shadow-glass-lg
                 flex flex-col overflow-hidden"
      >
        <!-- Drag Handle -->
        <div class="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div class="w-12 h-1.5 rounded-full bg-night-muted/50"/>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-3 border-b border-glass-border flex-shrink-0">
          <h2 class="text-lg font-display font-bold text-cat-eye">
            中奖历史
          </h2>
          <button
              class="w-10 h-10 rounded-2xl flex items-center justify-center
                     text-txt-muted hover:text-cat-eye hover:bg-glass-white
                     transition-all duration-200 active:scale-95"
              @click="close"
          >
            <X class="w-5 h-5"/>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-hidden">
          <DrawHistory class="h-full"/>
        </div>

        <!-- Close Button at Bottom - "Lazy" Principle: Easy thumb access -->
        <div class="p-4 border-t border-glass-border flex-shrink-0 safe-bottom">
          <button
              class="w-full py-4 rounded-2xl
                     bg-glass-white hover:bg-glass-highlight
                     text-txt-secondary font-semibold
                     transition-all duration-200 active:scale-[0.98]"
              @click="close"
          >
            关闭
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
