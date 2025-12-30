import {computed, ref} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {useConfetti} from './useConfetti'
import type {Item} from '@/types'

/**
 * 抽獎流程 Composable
 * 負責處理抽獎的核心邏輯：開始、結束、重置
 */
export function useDraw() {
    const gameStore = useGameStore()
    const uiStore = useUiStore()
    const {fireCelebration, fireRainbow} = useConfetti()

    // 預選的中獎者（在動畫開始時決定）
    const pendingWinners = ref<Item[]>([])

    // 當前分組
    const currentCategory = computed(() => gameStore.currentCategory)

    // 可用項目（未中獎）
    const availableItems = computed(() => gameStore.availableItems)

    // 已中獎項目
    const wonItems = computed(() => gameStore.wonItems)

    // 是否可以開始抽獎
    const canStartDraw = computed(() =>
        availableItems.value.length > 0 && !uiStore.isSpinning
    )

    // 動畫持續時間（毫秒）
    const animationDuration = computed(() =>
        gameStore.settings.spinDuration * 1000
    )

    /**
     * 開始抽獎
     * @returns boolean - 是否成功開始
     */
    const startDraw = (): boolean => {
        if (!currentCategory.value || !canStartDraw.value) {
            if (availableItems.value.length === 0) {
                uiStore.addToast('該分組已全部抽完！', 'warning')
            }
            return false
        }

        // 🎯 關鍵：先預選中獎者（不修改狀態）
        const winners = gameStore.preSelectWinners(
            currentCategory.value.id,
            uiStore.drawCount
        )

        if (winners.length === 0) {
            uiStore.addToast('沒有可抽取的參與者', 'warning')
            return false
        }

        // 保存預選的中獎者
        pendingWinners.value = winners

        // 開始旋轉動畫，傳入中獎者 ID
        uiStore.startSpin(winners.map(w => w.id))

        // 動畫結束後確認中獎
        setTimeout(() => {
            uiStore.stopSpin()

            // 確認中獎（標記狀態、記錄歷史）
            gameStore.confirmWinners(currentCategory.value!.id, pendingWinners.value)

            if (pendingWinners.value.length > 0) {
                // 根據中獎人數選擇彩花效果
                if (pendingWinners.value.length >= 3) {
                    fireRainbow()
                } else {
                    fireCelebration('cyan')
                }
                uiStore.showWinners(pendingWinners.value)
            }

            // 清空預選
            pendingWinners.value = []
        }, animationDuration.value)

        return true
    }

    /**
     * 確認重置中獎狀態
     */
    const confirmResetWinners = () => {
        if (!currentCategory.value) return

        uiStore.openConfirm({
            title: '重置中獎狀態',
            message: `確定要重置分組「${currentCategory.value.name}」中所有成員的中獎狀態嗎？`,
            confirmText: '重置',
            variant: 'warning',
            onConfirm: () => {
                gameStore.resetCategoryWinners(currentCategory.value!.id)
                uiStore.addToast('中獎狀態已重置', 'success')
            },
        })
    }

    /**
     * 切換分組
     */
    const selectCategory = (categoryId: string) => {
        gameStore.setCurrentCategory(categoryId)
    }

    return {
        // 計算屬性
        currentCategory,
        availableItems,
        wonItems,
        canStartDraw,
        animationDuration,
        pendingWinners,

        // 方法
        startDraw,
        confirmResetWinners,
        selectCategory,
    }
}
