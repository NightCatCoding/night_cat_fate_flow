<script setup lang="ts">
import {computed} from 'vue'
import {useUiStore} from '@/stores'
import {NButton} from '@/components/ui'
import {AlertCircle, AlertTriangle, Info} from 'lucide-vue-next'

const uiStore = useUiStore()

const config = computed(() => uiStore.confirmConfig)

const variantConfig = computed(() => ({
  danger: {
    icon: AlertTriangle,
    iconClass: 'text-accent-danger bg-accent-danger/15',
    borderClass: 'border-accent-danger/30',
  },
  warning: {
    icon: AlertCircle,
    iconClass: 'text-accent-warning bg-accent-warning/15',
    borderClass: 'border-accent-warning/30',
  },
  info: {
    icon: Info,
    iconClass: 'text-cat-eye bg-cat-eye/15',
    borderClass: 'border-cat-eye/30',
  },
}[config.value?.variant || 'info']))
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
      <!-- RESPONSIVE: Bottom sheet on mobile, center modal on desktop -->
      <div
          v-if="uiStore.showConfirmModal && config"
          class="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-night-void/80 backdrop-blur-xl"
      >
        <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-full md:translate-y-0 md:scale-95"
            enter-to-class="opacity-100 translate-y-0 md:scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 md:scale-100"
            leave-to-class="opacity-0 translate-y-full md:translate-y-0 md:scale-95"
        >
          <div
              v-if="uiStore.showConfirmModal"
              :class="[
              'w-full md:max-w-md p-6 md:p-8',
              'bg-night-surface/95 backdrop-blur-2xl',
              'border shadow-glass-lg',
              variantConfig.borderClass,
              // Mobile: Bottom sheet, Desktop: Center modal
              'rounded-t-4xl md:rounded-4xl md:mx-4'
            ]"
          >
            <!-- Drag Handle - Mobile Only -->
            <div class="flex justify-center mb-4 md:hidden">
              <div class="w-12 h-1.5 rounded-full bg-night-muted/50"/>
            </div>

            <!-- Icon -->
            <div class="flex justify-center mb-5 md:mb-6">
              <div
                  :class="['w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center', variantConfig.iconClass]">
                <component :is="variantConfig.icon" class="w-7 h-7 md:w-8 md:h-8"/>
              </div>
            </div>

            <!-- Title -->
            <h3 class="text-lg md:text-xl font-display font-bold text-txt-primary text-center mb-2 md:mb-3">
              {{ config.title }}
            </h3>

            <!-- Message -->
            <p class="text-sm md:text-base text-txt-secondary text-center mb-6 md:mb-8 font-medium leading-relaxed">
              {{ config.message }}
            </p>

            <!-- Actions - Stack on mobile for thumb zone -->
            <div class="flex flex-col-reverse md:flex-row gap-3 md:gap-4 safe-bottom">
              <NButton
                  variant="glass"
                  size="lg"
                  full-width
                  class="h-12 md:h-auto"
                  @click="uiStore.cancelAction"
              >
                取消
              </NButton>
              <NButton
                  :variant="config.variant === 'danger' ? 'danger' : 'primary'"
                  size="lg"
                  full-width
                  class="h-12 md:h-auto"
                  @click="uiStore.confirmAction"
              >
                {{ config.confirmText || '确认' }}
              </NButton>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
