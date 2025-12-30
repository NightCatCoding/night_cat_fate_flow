<script setup lang="ts">
import {useUiStore} from '@/stores'
import {Cat, History, Settings, Sparkles} from 'lucide-vue-next'

const uiStore = useUiStore()

const emit = defineEmits<{
  'open-history': []
}>()

const navItems = [
  {
    id: 'setup',
    icon: Cat,
    label: '配置',
    view: 'setup' as const,
  },
  {
    id: 'draw',
    icon: Sparkles,
    label: '抽奖',
    view: 'draw' as const,
  },
]
</script>

<template>
  <!-- Mobile Bottom Navigation Bar -->
  <!-- Thumb-Zone Optimized: Large touch targets at bottom of screen -->
  <nav class="fixed bottom-0 left-0 right-0 z-40 
              bg-night-deep/95 backdrop-blur-2xl 
              border-t border-glass-border
              safe-bottom">
    <div class="flex items-center justify-around h-16 px-2">
      <!-- Main Nav Items -->
      <button
          v-for="item in navItems"
          :key="item.id"
          :class="[
            'flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl',
            'transition-all duration-300 active:scale-95',
            'min-w-[72px] min-h-[52px]', // Large touch target
            uiStore.currentView === item.view
              ? 'text-cat-eye bg-cat-eye/10'
              : 'text-txt-muted hover:text-txt-secondary'
          ]"
          @click="uiStore.setView(item.view)"
      >
        <component
            :is="item.icon"
            :class="[
            'w-6 h-6 transition-transform duration-300',
            uiStore.currentView === item.view ? 'scale-110' : ''
          ]"
        />
        <span class="text-xs font-medium">{{ item.label }}</span>
      </button>

      <!-- History Button -->
      <button
          :class="[
            'flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl',
            'transition-all duration-300 active:scale-95',
            'min-w-[72px] min-h-[52px]',
            'text-txt-muted hover:text-txt-secondary'
          ]"
          @click="emit('open-history')"
      >
        <History class="w-6 h-6"/>
        <span class="text-xs font-medium">历史</span>
      </button>

      <!-- Settings Button -->
      <button
          :class="[
            'flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl',
            'transition-all duration-300 active:scale-95',
            'min-w-[72px] min-h-[52px]',
            'text-txt-muted hover:text-txt-secondary'
          ]"
          @click="uiStore.openSettingsModal"
      >
        <Settings class="w-6 h-6"/>
        <span class="text-xs font-medium">设置</span>
      </button>
    </div>
  </nav>
</template>
