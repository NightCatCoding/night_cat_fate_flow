<script setup lang="ts">
import {ref} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {NButton} from '@/components/ui'
import {Download, Settings, Upload} from 'lucide-vue-next'

defineOptions({name: 'AppHeader'})

const gameStore = useGameStore()
const uiStore = useUiStore()

const fileInputRef = ref<HTMLInputElement | null>(null)

const handleExportAll = () => {
  const data = gameStore.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `NightCat_backup_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  uiStore.addToast('配置已导出', 'success')
}

const handleImportConfig = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text)

    uiStore.openConfirm({
      title: '导入配置',
      message: '导入将覆盖现有数据，确定继续吗？',
      confirmText: '导入',
      variant: 'warning',
      onConfirm: () => {
        gameStore.importData(data)
        uiStore.addToast('配置导入成功', 'success')
      },
    })
  } catch (e) {
    uiStore.addToast('配置文件格式错误', 'error')
  }

  target.value = ''
}
</script>

<template>
  <!-- Desktop Header - Hidden on mobile (mobile uses bottom nav) -->
  <header class="fixed top-0 left-0 right-0 z-40 bg-night-deep/80 backdrop-blur-2xl border-b border-glass-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-3 group cursor-pointer">
        <div class="relative">
          <!-- Night Cat Logo 圖片 -->
          <img
              src="/night_cat_fate_flow_favicon.png"
              alt="Night Cat"
              class="w-8 h-8 md:w-12 md:h-12 object-contain transition-transform duration-300 group-hover:scale-125"
              draggable="false"
          />
        </div>
        <div>
          <h1 class="text-base md:text-lg font-display font-bold text-txt-primary tracking-wide group-hover:text-cat-eye transition-colors">
            Night Cat
          </h1>
          <p class="text-[10px] text-txt-muted uppercase tracking-[0.15em] font-medium">
            Serendipity
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 md:gap-2">
        <NButton
            size="sm"
            variant="ghost"
            title="导入配置"
            @click="fileInputRef?.click()"
        >
          <Upload class="w-4 h-4"/>
          <span class="hidden lg:inline text-sm">导入</span>
        </NButton>

        <NButton
            size="sm"
            variant="ghost"
            title="导出配置"
            @click="handleExportAll"
        >
          <Download class="w-4 h-4"/>
          <span class="hidden lg:inline text-sm">导出</span>
        </NButton>

        <div class="w-px h-6 bg-glass-border mx-1 hidden lg:block"/>

        <NButton
            size="sm"
            variant="glass"
            title="设置"
            @click="uiStore.openSettingsModal"
        >
          <Settings class="w-4 h-4"/>
        </NButton>

        <input
            ref="fileInputRef"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleImportConfig"
        />
      </div>
    </div>
  </header>
</template>
