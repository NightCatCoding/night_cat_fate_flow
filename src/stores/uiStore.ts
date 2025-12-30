import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {Item} from '@/types'

export const useUiStore = defineStore('ui', () => {
    // ============================================
    // 轉盤相關狀態
    // ============================================
    const isSpinning = ref(false)
    const rotation = ref(0)
    const drawCount = ref(1)

    // ============================================
    // Modal 狀態
    // ============================================
    const showWinnerModal = ref(false)
    const recentWinners = ref<Item[]>([])
    const showSettingsModal = ref(false)
    const showCategoryModal = ref(false)
    const showImportModal = ref(false)
    const showConfirmModal = ref(false)

    // 確認對話框配置
    const confirmConfig = ref<{
        title: string
        message: string
        confirmText: string
        cancelText: string
        variant: 'danger' | 'warning' | 'info'
        onConfirm: () => void
        onCancel?: () => void
    }>({
        title: '',
        message: '',
        confirmText: '確認',
        cancelText: '取消',
        variant: 'info',
        onConfirm: () => {
        },
    })

    // ============================================
    // Toast 通知
    // ============================================
    const toasts = ref<{
        id: string
        message: string
        type: 'success' | 'error' | 'info' | 'warning'
        duration: number
    }[]>([])

    // ============================================
    // 視圖與佈局狀態
    // ============================================
    const currentView = ref<'setup' | 'draw'>('setup')
    const sidebarCollapsed = ref(false)
    const isLoading = ref(false)

    // ============================================
    // Actions - 轉盤控制
    // ============================================
    const startSpin = () => {
        if (isSpinning.value) return
        isSpinning.value = true
        rotation.value += 1800 + Math.random() * 720 // 5-7 full rotations
    }

    const stopSpin = () => {
        isSpinning.value = false
    }

    const setDrawCount = (count: number) => {
        drawCount.value = Math.max(1, Math.min(100, count))
    }

    // Actions - Winner Modal
    const showWinners = (winners: Item[]) => {
        recentWinners.value = winners
        showWinnerModal.value = true
    }

    const closeWinnerModal = () => {
        showWinnerModal.value = false
        recentWinners.value = []
    }

    // Actions - Confirm Modal
    const openConfirm = (config: Partial<typeof confirmConfig.value>) => {
        confirmConfig.value = {
            title: config.title || '确认',
            message: config.message || '',
            confirmText: config.confirmText || '确认',
            cancelText: config.cancelText || '取消',
            variant: config.variant || 'info',
            onConfirm: config.onConfirm || (() => {
            }),
            onCancel: config.onCancel,
        }
        showConfirmModal.value = true
    }

    const closeConfirm = () => {
        showConfirmModal.value = false
    }

    const confirmAction = () => {
        confirmConfig.value.onConfirm()
        closeConfirm()
    }

    const cancelAction = () => {
        confirmConfig.value.onCancel?.()
        closeConfirm()
    }

    // Actions - Toast
    const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
        const id = crypto.randomUUID()
        toasts.value.push({id, message, type, duration})

        setTimeout(() => {
            removeToast(id)
        }, duration)

        return id
    }

    const removeToast = (id: string) => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index !== -1) {
            toasts.value.splice(index, 1)
        }
    }

    // Actions - View
    const setView = (view: 'setup' | 'draw') => {
        currentView.value = view
    }

    const toggleSidebar = () => {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // Actions - Modals
    const openSettingsModal = () => {
        showSettingsModal.value = true
    }

    const closeSettingsModal = () => {
        showSettingsModal.value = false
    }

    const openCategoryModal = () => {
        showCategoryModal.value = true
    }

    const closeCategoryModal = () => {
        showCategoryModal.value = false
    }

    const openImportModal = () => {
        showImportModal.value = true
    }

    const closeImportModal = () => {
        showImportModal.value = false
    }

    // Actions - Loading
    const setLoading = (loading: boolean) => {
        isLoading.value = loading
    }

    return {
        // State
        isSpinning,
        rotation,
        drawCount,
        showWinnerModal,
        recentWinners,
        showSettingsModal,
        showCategoryModal,
        showImportModal,
        showConfirmModal,
        confirmConfig,
        toasts,
        currentView,
        sidebarCollapsed,
        isLoading,

        // Actions - Wheel
        startSpin,
        stopSpin,
        setDrawCount,

        // Actions - Winner Modal
        showWinners,
        closeWinnerModal,

        // Actions - Confirm Modal
        openConfirm,
        closeConfirm,
        confirmAction,
        cancelAction,

        // Actions - Toast
        addToast,
        removeToast,

        // Actions - View
        setView,
        toggleSidebar,

        // Actions - Modals
        openSettingsModal,
        closeSettingsModal,
        openCategoryModal,
        closeCategoryModal,
        openImportModal,
        closeImportModal,

        // Actions - Loading
        setLoading,
    }
})
