<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {NToast} from '@/components/ui'
import {AppHeader, ConfirmModal, HistoryDrawer, MobileNav, SettingsModal, WinnerModal} from '@/components/layout'
import SetupView from '@/views/SetupView.vue'
import DrawView from '@/views/DrawView.vue'

defineOptions({name: 'App'})

const gameStore = useGameStore()
const uiStore = useUiStore()

// Mobile history drawer state
const showHistoryDrawer = ref(false)

onMounted(() => {
  gameStore.initializeDefaultCategory()
})

// Provide drawer control to child components
const toggleHistoryDrawer = () => {
  showHistoryDrawer.value = !showHistoryDrawer.value
}

// Expose for child components
defineExpose({toggleHistoryDrawer, showHistoryDrawer})
</script>

<template>
  <div
      class="min-h-screen bg-night-deep text-txt-primary font-sans antialiased selection:bg-cat-eye/30 overflow-x-hidden">
    <!-- App Header - Desktop only -->
    <AppHeader class="hidden md:block"/>

    <!-- Main Content Area -->
    <!-- Mobile: account for bottom nav (pb-20), Desktop: account for top header (pt-20) -->
    <main class="pb-24 md:pb-8">
      <Transition
          mode="out-in"
          enter-active-class="transition-all duration-400 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
      >
        <SetupView v-if="uiStore.currentView === 'setup'" @open-history="showHistoryDrawer = true"/>
        <DrawView v-else @open-history="showHistoryDrawer = true"/>
      </Transition>
    </main>

    <!-- Mobile Bottom Navigation -->
    <MobileNav
        class="md:hidden"
        @open-history="showHistoryDrawer = true"
    />

    <!-- Mobile History Drawer (Slide-over) -->
    <HistoryDrawer
        v-model="showHistoryDrawer"
        class="md:hidden"
    />

    <!-- Global Modals -->
    <SettingsModal/>
    <WinnerModal/>
    <ConfirmModal/>

    <!-- Toast Notifications -->
    <NToast/>
  </div>
</template>

<style>
/* Focus visible for accessibility */
:focus-visible {
  outline: 2px solid rgba(45, 212, 191, 0.5);
  outline-offset: 2px;
}

/* Prevent body scroll when drawer is open */
body.drawer-open {
  overflow: hidden;
}

/* Safe area insets for mobile devices */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .safe-bottom {
    padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
  }
}
</style>
