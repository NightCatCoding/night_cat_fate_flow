<script setup lang="ts">
import {watch} from 'vue'
import {useUiStore} from '@/stores'
import {useConfetti} from '@/composables'
import {NButton} from '@/components/ui'
import {Crown, PartyPopper, Sparkles} from 'lucide-vue-next'

defineOptions({name: 'WinnerModal'})

const uiStore = useUiStore()
const {fireStars} = useConfetti()

// 弹窗开启时补充星星效果（主要彩花已在 useDraw 触发）
watch(() => uiStore.showWinnerModal, (show) => {
  if (show && uiStore.recentWinners.length > 0) {
    // 延迟发射星星，与主彩花错开
    setTimeout(() => {
      fireStars('gold')
    }, 800)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <!-- 背景遮罩层 - z-[90]，让彩花(z-95)可以显示在上面 -->
      <div
          v-if="uiStore.showWinnerModal"
          class="fixed inset-0 z-[90] bg-night-void/80 backdrop-blur-xl"
      />
    </Transition>

    <!-- Modal 内容层 - z-[100]，在彩花之上 -->
    <Transition
        enter-active-class="transition-all duration-500 ease-out delay-100"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
    >
      <div
          v-if="uiStore.showWinnerModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
            class="relative w-full max-w-[92vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl
                 p-6 sm:p-8 md:p-10 lg:p-14
                 text-center
                 bg-glass-white backdrop-blur-2xl border border-cat-eye/30
                 shadow-glow-lg
                 rounded-4xl md:rounded-5xl
                 max-h-[85vh] overflow-y-auto
                 pointer-events-auto"
        >
          <!-- Decorative crowns -->
          <div class="absolute top-4 md:top-6 left-4 md:left-6 opacity-60">
            <Crown class="w-6 h-6 md:w-8 md:h-8 text-accent-warm animate-float-slow"/>
          </div>
          <div class="absolute top-4 md:top-6 right-4 md:right-6 opacity-60">
            <Crown class="w-6 h-6 md:w-8 md:h-8 text-accent-warm animate-float-slow" style="animation-delay: 0.5s"/>
          </div>

          <!-- Title - Responsive sizing -->
          <h2 class="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl
                     mb-6 sm:mb-8 md:mb-10 lg:mb-14
                     mt-2 sm:mt-0
                     animate-float-lazy
                     text-transparent bg-clip-text bg-gradient-to-r from-cat-spark via-cat-eye to-cat-glow">
            <PartyPopper
                class="inline-block w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mr-2 md:mr-3 -mt-1 md:-mt-2 text-accent-warm"
            />
            天选之人
            <PartyPopper
                class="inline-block w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ml-2 md:ml-3 -mt-1 md:-mt-2 text-accent-warm"
                style="transform: scaleX(-1)"
            />
          </h2>

          <!-- Winners - 手机版更大更醒目 -->
          <div class="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 lg:gap-10
                      mb-8 sm:mb-10 md:mb-14 lg:mb-16
                      min-h-[80px] sm:min-h-[100px]">
            <div
                v-for="(winner, index) in uiStore.recentWinners"
                :key="winner.id"
                class="animate-slide-up"
                :style="{ animationDelay: `${index * 0.12}s` }"
            >
              <div
                  class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                       font-black font-mono animate-float-lazy
                       text-transparent bg-clip-text bg-gradient-to-b from-cat-spark via-cat-eye to-cat-glow
                       drop-shadow-[0_0_30px_rgba(45,212,191,0.5)]"
                  :style="{ animationDelay: `${index * 0.2}s` }"
              >
                {{ winner.name }}
              </div>
            </div>
          </div>

          <!-- Continue button -->
          <NButton
              size="xl"
              :full-width="true"
              class="sm:w-auto font-display tracking-wider px-8 sm:px-14 md:px-20 h-14 sm:h-auto"
              @click="uiStore.closeWinnerModal"
          >
            <Sparkles class="w-5 h-5"/>
            继续抽奖
          </NButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
