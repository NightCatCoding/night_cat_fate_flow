import {computed} from 'vue'
import {useGameStore, useUiStore} from '@/stores'

// 吉祥物狀態類型
export type MascotState =
    | 'idle'       // 閒置
    | 'waiting'    // 等待（無分組）
    | 'empty'      // 空（無可用項目）
    | 'spinning'   // 旋轉中
    | 'winner'     // 中獎慶祝

/**
 * 吉祥物狀態 Composable
 * 根據應用狀態自動計算吉祥物應顯示的狀態
 *
 * @param context - 使用場景：'setup' 配置頁 | 'draw' 抽獎頁
 */
export function useMascotState(context: 'setup' | 'draw' = 'draw') {
    const gameStore = useGameStore()
    const uiStore = useUiStore()

    const mascotState = computed<MascotState>(() => {
        // 抽獎頁面特有狀態
        if (context === 'draw') {
            if (uiStore.isSpinning) return 'spinning'
        }

        // 配置頁面特有狀態
        if (context === 'setup') {
            if (gameStore.categories.length === 0) return 'waiting'
        }

        // 共用邏輯
        if (gameStore.availableItems.length === 0) return 'empty'

        return context === 'setup' ? 'idle' : 'waiting'
    })

    // 吉祥物對話氣泡文字
    const mascotMessage = computed(() => {
        switch (mascotState.value) {
            case 'waiting':
                return context === 'setup'
                    ? '創建一個分組開始吧~'
                    : '準備好了嗎？'
            case 'empty':
                return '添加一些參與者吧！'
            case 'spinning':
                return '命運正在轉動...'
            case 'winner':
                return '恭喜中獎！🎉'
            case 'idle':
            default:
                return '喵~'
        }
    })

    return {
        mascotState,
        mascotMessage,
    }
}
