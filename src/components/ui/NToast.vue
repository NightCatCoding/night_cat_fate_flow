<script setup lang="ts">
import {useUiStore} from '@/stores'
import {AlertCircle, CheckCircle, Info, X, XCircle} from 'lucide-vue-next'

const uiStore = useUiStore()

const typeConfig = {
  success: {
    icon: CheckCircle,
    class: 'bg-accent-success/15 border-accent-success/30 text-accent-success',
    iconClass: 'text-accent-success',
  },
  error: {
    icon: XCircle,
    class: 'bg-accent-danger/15 border-accent-danger/30 text-accent-danger',
    iconClass: 'text-accent-danger',
  },
  warning: {
    icon: AlertCircle,
    class: 'bg-accent-warning/15 border-accent-warning/30 text-accent-warning',
    iconClass: 'text-accent-warning',
  },
  info: {
    icon: Info,
    class: 'bg-cat-eye/15 border-cat-eye/30 text-cat-eye',
    iconClass: 'text-cat-eye',
  },
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-20 right-4 z-[70] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup
          enter-active-class="transition-all duration-400 ease-out"
          enter-from-class="opacity-0 translate-x-8 scale-95"
          enter-to-class="opacity-100 translate-x-0 scale-100"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-8 scale-95"
      >
        <div
            v-for="toast in uiStore.toasts"
            :key="toast.id"
            :class="[
            'flex items-center gap-4 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-glass pointer-events-auto',
            'max-w-sm min-w-[280px]',
            typeConfig[toast.type].class
          ]"
        >
          <component
              :is="typeConfig[toast.type].icon"
              :class="['w-5 h-5 flex-shrink-0', typeConfig[toast.type].iconClass]"
          />

          <p class="flex-1 text-sm font-medium text-txt-primary">
            {{ toast.message }}
          </p>

          <button
              class="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center
                   text-txt-muted hover:text-txt-primary hover:bg-glass-white
                   transition-all duration-200"
              @click="uiStore.removeToast(toast.id)"
          >
            <X class="w-4 h-4"/>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
