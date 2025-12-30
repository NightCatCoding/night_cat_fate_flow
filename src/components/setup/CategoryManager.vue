<script setup lang="ts">
import {ref, watch} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {NButton, NColorPicker, NInput, NModal} from '@/components/ui'
import {FolderOpen, Pencil, Plus, RotateCcw, Trash2, Trophy, Users} from 'lucide-vue-next'
import type {Category, ThemeColor} from '@/types'

defineOptions({name: 'CategoryManager'})

const gameStore = useGameStore()
const uiStore = useUiStore()

// 颜色映射 - 用于显示分组颜色和应用主题
const colorStyles: Record<ThemeColor, {
  bg: string
  border: string
  glow: string
  gradient: string
  cssVars: { eye: string; spark: string; glow: string }
}> = {
  cyan: {
    bg: 'bg-cyan-400',
    border: 'border-cyan-400/40',
    glow: 'shadow-[0_0_12px_rgba(34,211,238,0.5)]',
    gradient: 'from-cyan-400 to-teal-500',
    cssVars: {eye: '34, 211, 238', spark: '45, 212, 191', glow: '20, 184, 166'}
  },
  blue: {
    bg: 'bg-blue-400',
    border: 'border-blue-400/40',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]',
    gradient: 'from-blue-400 to-indigo-500',
    cssVars: {eye: '59, 130, 246', spark: '99, 102, 241', glow: '79, 70, 229'}
  },
  purple: {
    bg: 'bg-purple-400',
    border: 'border-purple-400/40',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
    gradient: 'from-violet-400 to-purple-600',
    cssVars: {eye: '168, 85, 247', spark: '139, 92, 246', glow: '124, 58, 237'}
  },
  pink: {
    bg: 'bg-pink-400',
    border: 'border-pink-400/40',
    glow: 'shadow-[0_0_12px_rgba(236,72,153,0.5)]',
    gradient: 'from-pink-400 to-rose-500',
    cssVars: {eye: '236, 72, 153', spark: '244, 114, 182', glow: '219, 39, 119'}
  },
  gold: {
    bg: 'bg-amber-400',
    border: 'border-amber-400/40',
    glow: 'shadow-[0_0_12px_rgba(251,191,36,0.5)]',
    gradient: 'from-amber-300 to-orange-500',
    cssVars: {eye: '251, 191, 36', spark: '245, 158, 11', glow: '217, 119, 6'}
  },
  emerald: {
    bg: 'bg-emerald-400',
    border: 'border-emerald-400/40',
    glow: 'shadow-[0_0_12px_rgba(52,211,153,0.5)]',
    gradient: 'from-emerald-400 to-green-600',
    cssVars: {eye: '52, 211, 153', spark: '34, 197, 94', glow: '22, 163, 74'}
  },
}

// 应用主题色到 CSS 变量
const applyThemeColor = (themeColor: ThemeColor) => {
  const style = colorStyles[themeColor] || colorStyles.cyan
  document.documentElement.style.setProperty('--cat-eye', style.cssVars.eye)
  document.documentElement.style.setProperty('--cat-spark', style.cssVars.spark)
  document.documentElement.style.setProperty('--cat-glow', style.cssVars.glow)
}

// 监听当前分组变化，应用主题色
watch(() => gameStore.currentCategory, (category) => {
  if (category) {
    applyThemeColor(category.themeColor)
  }
}, {immediate: true})

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref<Category | null>(null)

// Form state
const newCategoryName = ref('')
const newCategoryColor = ref<ThemeColor>('cyan')

const openCreateModal = () => {
  newCategoryName.value = ''
  newCategoryColor.value = 'cyan'
  showCreateModal.value = true
}

const createCategory = () => {
  if (!newCategoryName.value.trim()) {
    uiStore.addToast('请输入分组名称', 'warning')
    return
  }

  const category = gameStore.createCategory(newCategoryName.value.trim(), newCategoryColor.value)
  gameStore.setCurrentCategory(category.id)
  showCreateModal.value = false
  uiStore.addToast('分组创建成功', 'success')
}

const openEditModal = (category: Category) => {
  editingCategory.value = category
  newCategoryName.value = category.name
  newCategoryColor.value = category.themeColor
  showEditModal.value = true
}

const updateCategory = () => {
  if (!editingCategory.value || !newCategoryName.value.trim()) return

  gameStore.updateCategory(editingCategory.value.id, {
    name: newCategoryName.value.trim(),
    themeColor: newCategoryColor.value,
  })
  // 如果更新的是当前分组，重新应用主题色
  if (editingCategory.value.id === gameStore.currentCategoryId) {
    applyThemeColor(newCategoryColor.value)
  }
  showEditModal.value = false
  uiStore.addToast('分组更新成功', 'success')
}

const confirmDeleteCategory = (category: Category) => {
  uiStore.openConfirm({
    title: '删除分组',
    message: `确定要删除分组「${category.name}」吗？该分组下的所有成员将被永久删除。`,
    confirmText: '删除',
    variant: 'danger',
    onConfirm: () => {
      gameStore.deleteCategory(category.id)
      uiStore.addToast('分组已删除', 'success')
    },
  })
}

const confirmResetCategory = (category: Category) => {
  uiStore.openConfirm({
    title: '重置中奖状态',
    message: `确定要重置分组「${category.name}」中所有成员的中奖状态吗？`,
    confirmText: '重置',
    variant: 'warning',
    onConfirm: () => {
      gameStore.resetCategoryWinners(category.id)
      uiStore.addToast('中奖状态已重置', 'success')
    },
  })
}

const selectCategory = (category: Category) => {
  gameStore.setCurrentCategory(category.id)
}

// 获取分组的颜色样式
const getCategoryColorStyle = (category: Category) => {
  return colorStyles[category.themeColor] || colorStyles.cyan
}
</script>

<template>
  <div class="space-y-4 md:space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-semibold text-cat-eye flex items-center gap-2">
        <FolderOpen class="w-4 h-4"/>
        分组管理
      </h2>
      <NButton size="xs" @click="openCreateModal">
        <Plus class="w-3.5 h-3.5"/>
        新建
      </NButton>
    </div>

    <!-- Category List -->
    <div class="space-y-2 md:space-y-3">
      <div
          v-for="category in gameStore.categories"
          :key="category.id"
          :class="[
          'group relative p-3 md:p-5 rounded-xl md:rounded-3xl border-2 transition-all duration-300 cursor-pointer',
          gameStore.currentCategoryId === category.id
            ? [getCategoryColorStyle(category).border, 'bg-glass-highlight']
            : 'bg-glass-white border-glass-border hover:bg-glass-highlight'
        ]"
          @click="selectCategory(category)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5 md:gap-4">
            <!-- Color indicator -->
            <div
                :class="[
                'w-3.5 h-3.5 md:w-5 md:h-5 rounded-full transition-all duration-300',
                getCategoryColorStyle(category).bg,
                gameStore.currentCategoryId === category.id
                  ? getCategoryColorStyle(category).glow
                  : 'opacity-70'
              ]"
            />
            <div>
              <h3 class="font-semibold text-sm text-txt-primary">
                {{ category.name }}
              </h3>
              <div class="flex items-center gap-3 text-xs text-txt-muted mt-0.5 md:mt-1.5 font-medium">
                <span class="flex items-center gap-1">
                  <Users class="w-3 h-3"/>
                  {{ category.items.length }}
                </span>
                <span class="flex items-center gap-1">
                  <Trophy class="w-3 h-3"/>
                  {{ category.items.filter(i => i.hasWon).length }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-0.5 opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <NButton
                size="xs"
                variant="ghost"
                icon
                title="重置状态"
                @click.stop="confirmResetCategory(category)"
            >
              <RotateCcw class="w-3.5 h-3.5"/>
            </NButton>
            <NButton
                size="xs"
                variant="ghost"
                icon
                title="编辑"
                @click.stop="openEditModal(category)"
            >
              <Pencil class="w-3.5 h-3.5"/>
            </NButton>
            <NButton
                size="xs"
                variant="ghost"
                icon
                title="删除"
                @click.stop="confirmDeleteCategory(category)"
            >
              <Trash2 class="w-3.5 h-3.5 text-accent-danger"/>
            </NButton>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mt-2.5 md:mt-4 h-1 md:h-1.5 bg-night-surface/50 rounded-full overflow-hidden">
          <div
              :class="[
              'h-full rounded-full transition-all duration-500 bg-gradient-to-r',
              getCategoryColorStyle(category).gradient
            ]"
              :style="{
              width: category.items.length > 0
                ? `${(category.items.filter(i => !i.hasWon).length / category.items.length) * 100}%`
                : '0%'
            }"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div
          v-if="gameStore.categories.length === 0"
          class="text-center py-8 md:py-12 text-txt-muted"
      >
        <FolderOpen class="w-10 h-10 md:w-14 md:h-14 mx-auto mb-3 opacity-30"/>
        <p class="font-medium text-sm">暂无分组</p>
        <p class="text-xs mt-1 opacity-70">点击上方按钮创建第一个分组</p>
      </div>
    </div>

    <!-- Create Modal -->
    <NModal v-model="showCreateModal" title="新建分组" size="sm">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-txt-secondary mb-3">
            分组名称
          </label>
          <NInput
              v-model="newCategoryName"
              placeholder="输入分组名称..."
              size="lg"
              @enter="createCategory"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-txt-secondary mb-3">
            主题颜色
          </label>
          <NColorPicker v-model="newCategoryColor"/>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <NButton variant="ghost" @click="showCreateModal = false">取消</NButton>
          <NButton @click="createCategory">创建</NButton>
        </div>
      </template>
    </NModal>

    <!-- Edit Modal -->
    <NModal v-model="showEditModal" title="编辑分组" size="sm">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-txt-secondary mb-3">
            分组名称
          </label>
          <NInput
              v-model="newCategoryName"
              placeholder="输入分组名称..."
              size="lg"
              @enter="updateCategory"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-txt-secondary mb-3">
            主题颜色
          </label>
          <NColorPicker v-model="newCategoryColor"/>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <NButton variant="ghost" @click="showEditModal = false">取消</NButton>
          <NButton @click="updateCategory">保存</NButton>
        </div>
      </template>
    </NModal>
  </div>
</template>
