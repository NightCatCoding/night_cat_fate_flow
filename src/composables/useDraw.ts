import {computed} from 'vue'
import {useGameStore, useUiStore} from '@/stores'
import {useConfetti} from './useConfetti'

// 動畫時長映射（毫秒）
const ANIMATION_DURATION_MAP = {
    slow: 7000,
    normal: 5000,
    fast: 3000,
} as const

/**
 * 抽獎流程 Composable
 * 負責處理抽獎的核心邏輯：開始、結束、重置
 */
export function useDraw() {
    const gameStore = useGameStore()
    const uiStore = useUiStore()
    const {fireCelebration, fireRainbow} = useConfetti()

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

    // 動畫持續時間
    const animationDuration = computed(() =>
        ANIMATION_DURATION_MAP[gameStore.settings.animationSpeed]
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

        // 開始旋轉動畫
        uiStore.startSpin()

        // 動畫結束後執行抽獎
        setTimeout(() => {
            uiStore.stopSpin()

            const winners = gameStore.performDraw(
                currentCategory.value!.id,
                uiStore.drawCount
            )

            if (winners.length > 0) {
                // 根據中獎人數選擇彩花效果
                if (winners.length >= 3) {
                    // 多人中獎 - 彩虹瀑布效果
                    fireRainbow()
                } else {
                    // 1-2人中獎 - 豪華慶祝效果
                    fireCelebration('cyan')
                }
                uiStore.showWinners(winners)
            }
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

        // 方法
        startDraw,
        confirmResetWinners,
        selectCategory,
    }
}
