<script setup lang="ts">
import {computed} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {useMascotState} from '@/composables'
import {NAmbientBg, NButton, NCard} from '@/components/ui'
import {CategoryManager, NameInput} from '@/components/setup'
import {DrawHistory} from '@/components/history'
import {MascotReaction} from '@/components/mascot'
import {ArrowRight, FolderOpen, Sparkles, Trophy, Users, Zap} from 'lucide-vue-next'

defineOptions({name: 'SetupView'})

const gameStore = useGameStore()
const uiStore = useUiStore()

// 使用 useMascotState 处理吉祥物状态
const {mascotState} = useMascotState('setup')

// 是否可以开始抽奖
const canStartDraw = computed(() => {
  return gameStore.availableItems.length > 0
})

// 进入抽奖页面
const goToDraw = () => {
  if (!canStartDraw.value) {
    uiStore.addToast('请先添加选项', 'warning')
    return
  }
  uiStore.setView('draw')
}

// 统计数据
const totalPeople = computed(() =>
    gameStore.categories.reduce((sum, c) => sum + c.items.length, 0)
)
const remainingPeople = computed(() =>
    gameStore.categories.reduce((sum, c) => sum + c.items.filter(i => !i.hasWon).length, 0)
)
</script>

<template>
  <div class="min-h-screen pt-4 md:pt-20 px-3 sm:px-6 pb-4 md:pb-32 animate-fade-in bg-night-deep">
    <!-- 共用背景光晕组件 -->
    <NAmbientBg/>

    <div class="relative z-10 max-w-7xl mx-auto">
      <!-- Header with Mascot -->
      <header class="text-center mb-4 sm:mb-10 md:mb-14">
        <!-- Mascot - Responsive sizing -->
        <div class="flex justify-center mb-2 md:mb-6">
          <MascotReaction
              :state="mascotState"
              size="sm"
              :show-bubble="false"
              class="md:hidden"
          />
          <MascotReaction
              :state="mascotState"
              size="md"
              :show-bubble="false"
              class="hidden md:block"
          />
        </div>

        <h1 class="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cat-spark via-cat-eye to-cat-glow mb-1 md:mb-4">
          随机抽选中心
        </h1>
        <p class="text-txt-muted text-xs md:text-base lg:text-lg font-medium max-w-md mx-auto">
          配置清单与候选选项，万物皆可抽
        </p>
      </header>

      <!-- Stats Bar - 手机版单行紧凑 / 桌面版卡片 -->
      <!-- Mobile: 单行紧凑统计 -->
      <div
          class="flex md:hidden justify-center gap-4 mb-4 py-2 px-3 bg-night-surface/30 backdrop-blur-sm rounded-xl border border-glass-border/30">
        <div class="flex items-center gap-1.5">
          <FolderOpen class="w-3.5 h-3.5 text-cat-eye/70"/>
          <span class="font-mono font-bold text-cat-eye">{{ gameStore.categories.length }}</span>
          <span class="text-[10px] text-txt-muted">清单</span>
        </div>
        <div class="w-px h-4 bg-glass-border/50"/>
        <div class="flex items-center gap-1.5">
          <Users class="w-3.5 h-3.5 text-cat-eye/70"/>
          <span class="font-mono font-bold text-cat-eye">{{ totalPeople }}</span>
          <span class="text-[10px] text-txt-muted">选项</span>
        </div>
        <div class="w-px h-4 bg-glass-border/50"/>
        <div class="flex items-center gap-1.5">
          <Sparkles class="w-3.5 h-3.5 text-accent-success/70"/>
          <span class="font-mono font-bold text-accent-success">{{ remainingPeople }}</span>
          <span class="text-[10px] text-txt-muted">待选</span>
        </div>
        <div class="w-px h-4 bg-glass-border/50"/>
        <div class="flex items-center gap-1.5">
          <Trophy class="w-3.5 h-3.5 text-accent-warm/70"/>
          <span class="font-mono font-bold text-accent-warm">{{ gameStore.history.length }}</span>
          <span class="text-[10px] text-txt-muted">次</span>
        </div>
      </div>

      <!-- Desktop: 卡片式统计 -->
      <div class="hidden md:grid grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-10">
        <NCard variant="glass" padding="md" class="text-center group" hoverable>
          <div class="flex items-center justify-center gap-2 mb-1">
            <FolderOpen class="w-4 h-4 text-cat-eye/70"/>
          </div>
          <div
              class="text-3xl lg:text-4xl font-mono font-bold text-cat-eye group-hover:text-cat-spark transition-colors">
            {{ gameStore.categories.length }}
          </div>
          <div class="text-xs text-txt-muted uppercase tracking-wider font-medium mt-1">清单</div>
        </NCard>

        <NCard variant="glass" padding="md" class="text-center group" hoverable>
          <div class="flex items-center justify-center gap-2 mb-1">
            <Users class="w-4 h-4 text-cat-eye/70"/>
          </div>
          <div
              class="text-3xl lg:text-4xl font-mono font-bold text-cat-eye group-hover:text-cat-spark transition-colors">
            {{ totalPeople }}
          </div>
          <div class="text-xs text-txt-muted uppercase tracking-wider font-medium mt-1">总选项</div>
        </NCard>

        <NCard variant="glass" padding="md" class="text-center group" hoverable>
          <div class="flex items-center justify-center gap-2 mb-1">
            <Sparkles class="w-4 h-4 text-accent-success/70"/>
          </div>
          <div
              class="text-3xl lg:text-4xl font-mono font-bold text-accent-success group-hover:text-emerald-300 transition-colors">
            {{ remainingPeople }}
          </div>
          <div class="text-xs text-txt-muted uppercase tracking-wider font-medium mt-1">待选</div>
        </NCard>

        <NCard variant="glass" padding="md" class="text-center group" hoverable>
          <div class="flex items-center justify-center gap-2 mb-1">
            <Trophy class="w-4 h-4 text-accent-warm/70"/>
          </div>
          <div
              class="text-3xl lg:text-4xl font-mono font-bold text-accent-warm group-hover:text-amber-300 transition-colors">
            {{ gameStore.history.length }}
          </div>
          <div class="text-xs text-txt-muted uppercase tracking-wider font-medium mt-1">已选次数</div>
        </NCard>
      </div>

      <!-- ========================================== -->
      <!-- RESPONSIVE LAYOUT: Mobile Stack / Desktop Grid -->
      <!-- ========================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6 lg:gap-8">

        <!-- Left: Category Manager -->
        <div class="lg:col-span-3 order-1">
          <NCard variant="glass" padding="md" class="md:p-6 lg:p-8">
            <CategoryManager/>
          </NCard>
        </div>

        <!-- Center: Name Input -->
        <div class="lg:col-span-5 order-2 pb-4 md:pb-0">
          <NCard variant="glass" padding="md" class="md:p-6 lg:p-8">
            <NameInput/>
          </NCard>
        </div>

        <!-- Right: History - Desktop Only -->
        <div class="hidden lg:block lg:col-span-4 order-3">
          <DrawHistory/>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- DESKTOP FIXED BOTTOM CTA BUTTON -->
    <!-- ========================================== -->
    <div
        class="hidden md:block fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-night-deep via-night-deep/95 to-transparent pt-8 pb-6">
      <div class="text-center">
        <NButton
            size="xl"
            :disabled="!canStartDraw"
            class="px-16 font-display tracking-wider shadow-glow-lg"
            @click="goToDraw"
        >
          <Zap class="w-6 h-6"/>
          开始抽选
          <ArrowRight class="w-6 h-6"/>
        </NButton>

        <p v-if="!canStartDraw" class="text-sm text-txt-muted mt-3 font-medium">
          请先选择清单并添加选项
        </p>
      </div>
    </div>
  </div>
</template>
