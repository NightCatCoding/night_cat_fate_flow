<script setup lang="ts">
import {computed, ref} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {useExcel} from '@/composables'
import {NButton, NInput} from '@/components/ui'
import {Check, Download, FileSpreadsheet, FileText, Pencil, Trash2, Upload, UserPlus, X} from 'lucide-vue-next'

defineOptions({name: 'NameInput'})

const gameStore = useGameStore()
const uiStore = useUiStore()
const {importFromExcel, exportToExcel, downloadTemplate} = useExcel()

// State
const singleNameInput = ref('')
const bulkInput = ref('')
const showBulkInput = ref(false)
const editingItemId = ref<string | null>(null)
const editingItemName = ref('')

const fileInputRef = ref<HTMLInputElement | null>(null)

const currentCategory = computed(() => gameStore.currentCategory)

// Add single name
const addSingleName = () => {
  if (!currentCategory.value) {
    uiStore.addToast('请先选择一个分组', 'warning')
    return
  }

  const name = singleNameInput.value.trim()
  if (!name) {
    uiStore.addToast('请输入名称', 'warning')
    return
  }

  gameStore.addItem(currentCategory.value.id, name)
  singleNameInput.value = ''
  uiStore.addToast('添加成功', 'success')
}

// Add bulk names
const addBulkNames = () => {
  if (!currentCategory.value) {
    uiStore.addToast('请先选择一个分组', 'warning')
    return
  }

  const names = bulkInput.value
      .split(/[\n,，;；]/)
      .map(n => n.trim())
      .filter(Boolean)
  
  if (names.length === 0) {
    uiStore.addToast('请输入至少一个名称', 'warning')
    return
  }

  const addedItems = gameStore.addBulkItems(currentCategory.value.id, names)
  bulkInput.value = ''
  showBulkInput.value = false
  uiStore.addToast(`成功添加 ${addedItems.length} 个名称`, 'success')
}

// Handle file import
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !currentCategory.value) return

  const result = await importFromExcel(file, currentCategory.value.id)

  if (result.success) {
    uiStore.addToast(`成功导入 ${result.count} 条数据`, 'success')
  } else {
    uiStore.addToast(result.error || '导入失败', 'error')
  }

  target.value = ''
}

// Edit item
const startEditItem = (itemId: string, currentName: string) => {
  editingItemId.value = itemId
  editingItemName.value = currentName
}

const saveEditItem = () => {
  if (!currentCategory.value || !editingItemId.value) return

  const name = editingItemName.value.trim()
  if (!name) {
    uiStore.addToast('名称不能为空', 'warning')
    return
  }

  gameStore.updateItem(currentCategory.value.id, editingItemId.value, {name})
  editingItemId.value = null
  editingItemName.value = ''
}

const cancelEditItem = () => {
  editingItemId.value = null
  editingItemName.value = ''
}

// Delete item
const deleteItem = (itemId: string) => {
  if (!currentCategory.value) return
  gameStore.deleteItem(currentCategory.value.id, itemId)
}
</script>

<template>
  <div class="space-y-6">
    <!-- No category selected -->
    <div
        v-if="!currentCategory"
        class="text-center py-16 text-txt-muted"
    >
      <UserPlus class="w-14 h-14 mx-auto mb-4 opacity-30"/>
      <p class="font-medium">请先选择或创建一个分组</p>
    </div>

    <template v-else>
      <!-- Input Section -->
      <div>
        <h3 class="text-sm font-semibold mb-4 flex items-center gap-2 text-cat-eye">
          <UserPlus class="w-4 h-4"/>
          添加成员到「{{ currentCategory.name }}」
        </h3>

        <!-- Single Input -->
        <div v-if="!showBulkInput" class="space-y-4">
          <div class="flex gap-3">
            <NInput
                v-model="singleNameInput"
                placeholder="输入名称..."
                size="lg"
                class="flex-1"
                @enter="addSingleName"
            />
            <NButton size="lg" @click="addSingleName">
              添加
            </NButton>
          </div>

          <div class="flex flex-wrap gap-2">
            <NButton size="sm" variant="glass" @click="showBulkInput = true">
              <FileText class="w-4 h-4"/>
              批量输入
            </NButton>
            <NButton size="sm" variant="glass" @click="fileInputRef?.click()">
              <Upload class="w-4 h-4"/>
              Excel 导入
            </NButton>
            <NButton size="sm" variant="ghost" @click="downloadTemplate">
              <Download class="w-4 h-4"/>
              下载模板
            </NButton>
          </div>
        </div>

        <!-- Bulk Input -->
        <div v-else class="space-y-4">
          <textarea
              v-model="bulkInput"
              placeholder="批量输入名称，每行一个，或用逗号/分号分隔..."
              class="w-full h-32 md:h-40 bg-night-surface/60 backdrop-blur-sm border-2 border-transparent
                   rounded-2xl md:rounded-3xl p-4 md:p-5 text-sm md:text-base text-txt-primary placeholder-txt-muted/60 font-medium
                   resize-none transition-all duration-300
                   focus:outline-none focus:bg-night-surface focus:border-cat-eye/40 focus:shadow-glow-sm
                   hover:bg-night-surface/80"
          />
          <div class="flex gap-3">
            <NButton @click="addBulkNames">
              确认添加
            </NButton>
            <NButton variant="ghost" @click="showBulkInput = false">
              取消
            </NButton>
          </div>
        </div>

        <input
            ref="fileInputRef"
            type="file"
            accept=".xlsx,.xls,.csv"
            class="hidden"
            @change="handleFileUpload"
        />
      </div>

      <!-- Item List -->
      <div class="bg-glass-white backdrop-blur-sm rounded-4xl border border-glass-border overflow-hidden">
        <div class="px-6 py-5 border-b border-glass-border flex items-center justify-between">
          <h3 class="font-semibold text-sm flex items-center gap-2 text-cat-eye">
            <FileSpreadsheet class="w-4 h-4"/>
            成员列表 ({{ currentCategory.items.length }})
          </h3>
          <NButton
              v-if="currentCategory.items.length > 0"
              size="xs"
              variant="ghost"
              @click="exportToExcel(currentCategory.id)"
          >
            <Download class="w-3.5 h-3.5"/>
            导出
          </NButton>
        </div>

        <div class="max-h-[350px] overflow-y-auto">
          <div
              v-if="currentCategory.items.length === 0"
              class="text-center py-12 text-txt-muted"
          >
            <p class="font-medium">暂无成员</p>
            <p class="text-sm mt-1 opacity-70">使用上方输入框添加成员</p>
          </div>

          <div v-else class="divide-y divide-glass-border/50">
            <div
                v-for="item in currentCategory.items"
                :key="item.id"
                :class="[
                'group flex items-center justify-between px-6 py-4',
                'hover:bg-glass-highlight transition-colors',
                item.hasWon ? 'opacity-50' : ''
              ]"
            >
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <!-- Status indicator -->
                <div
                    :class="[
                    'w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all',
                    item.hasWon ? 'bg-accent-warm' : 'bg-cat-eye'
                  ]"
                />

                <!-- Name (editing or display) -->
                <template v-if="editingItemId === item.id">
                  <NInput
                      v-model="editingItemName"
                      size="sm"
                      class="flex-1"
                      @enter="saveEditItem"
                  />
                  <NButton size="xs" variant="ghost" icon @click="saveEditItem">
                    <Check class="w-4 h-4 text-accent-success"/>
                  </NButton>
                  <NButton size="xs" variant="ghost" icon @click="cancelEditItem">
                    <X class="w-4 h-4 text-accent-danger"/>
                  </NButton>
                </template>

                <template v-else>
                  <span
                      :class="[
                      'truncate font-medium',
                      item.hasWon ? 'line-through text-txt-muted' : 'text-txt-primary'
                    ]"
                  >
                    {{ item.name }}
                  </span>

                  <span
                      v-if="item.hasWon"
                      class="flex-shrink-0 text-xs px-2.5 py-1 rounded-full bg-accent-warm/20 text-accent-warm font-semibold"
                  >
                    已中奖
                  </span>
                </template>
              </div>

              <!-- Actions -->
              <div
                  v-if="editingItemId !== item.id"
                  class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <NButton
                    size="xs"
                    variant="ghost"
                    icon
                    @click="startEditItem(item.id, item.name)"
                >
                  <Pencil class="w-3.5 h-3.5"/>
                </NButton>
                <NButton
                    size="xs"
                    variant="ghost"
                    icon
                    @click="deleteItem(item.id)"
                >
                  <Trash2 class="w-3.5 h-3.5 text-accent-danger"/>
                </NButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
