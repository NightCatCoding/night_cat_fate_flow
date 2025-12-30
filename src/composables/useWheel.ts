import {computed, type Ref} from 'vue'
import type {Item} from '@/types'

// 轉盤顯示配置
const DISPLAY_SEGMENTS = 16

// 🎨 鮮豔多彩的抽獎轉盤配色 - 霓虹節慶風格
// 8色循環，確保相鄰顏色對比明顯
const FESTIVE_COLORS = [
    '#f43f5e', // Rose-500 - 玫瑰紅
    '#8b5cf6', // Violet-500 - 紫羅蘭
    '#3b82f6', // Blue-500 - 寶藍
    '#14b8a6', // Teal-500 - 青綠（貓眼色）
    '#f59e0b', // Amber-500 - 琥珀金
    '#ec4899', // Pink-500 - 粉紅
    '#06b6d4', // Cyan-500 - 青藍
    '#10b981', // Emerald-500 - 翡翠綠
] as const

// 文字顏色配置
const TEXT_COLORS = {
    light: '#ffffff',   // 白色文字（用於深色背景）
    dark: '#0f172a',    // 深色文字（用於淺色背景）
} as const

// 轉盤扇形數據結構
export interface WheelSegment {
    path: string
    fillColor: string
    textColor: string
    textX: number
    textY: number
    textRotation: number
    displayName: string
    id: string
}

/**
 * 轉盤邏輯 Composable
 * 負責計算轉盤的扇形、顏色、文字位置等
 */
export function useWheel(items: Ref<Item[]>) {
    // 計算顯示的項目（填滿所有扇形）
    const displayItems = computed(() => {
        if (items.value.length === 0) {
            return Array(DISPLAY_SEGMENTS).fill({name: '?', id: 'empty'})
        }

        if (items.value.length >= DISPLAY_SEGMENTS) {
            return items.value.slice(0, DISPLAY_SEGMENTS)
        }

        // 循環填充直到填滿扇形
        const result = []
        for (let i = 0; i < DISPLAY_SEGMENTS; i++) {
            result.push(items.value[i % items.value.length])
        }
        return result
    })

    // 計算 SVG 扇形數據
    const segments = computed<WheelSegment[]>(() => {
        const count = DISPLAY_SEGMENTS
        const anglePerSegment = 360 / count

        return displayItems.value.map((item, index) => {
            const startAngle = index * anglePerSegment
            const endAngle = (index + 1) * anglePerSegment
            const midAngle = startAngle + anglePerSegment / 2

            // 角度轉弧度
            const startRad = (startAngle * Math.PI) / 180
            const endRad = (endAngle * Math.PI) / 180
            const midRad = (midAngle * Math.PI) / 180

            const centerX = 50
            const centerY = 50
            const radius = 48 // 稍小一點留出內邊距
            const textRadius = 35

            // 計算扇形端點
            const x1 = centerX + radius * Math.cos(startRad)
            const y1 = centerY + radius * Math.sin(startRad)
            const x2 = centerX + radius * Math.cos(endRad)
            const y2 = centerY + radius * Math.sin(endRad)

            // 計算文字位置
            const textX = centerX + textRadius * Math.cos(midRad)
            const textY = centerY + textRadius * Math.sin(midRad)

            const largeArc = anglePerSegment > 180 ? 1 : 0
            const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

            // 🎨 使用8色循環，確保多彩效果
            const colorIndex = index % FESTIVE_COLORS.length
            const fillColor = FESTIVE_COLORS[colorIndex]

            // 所有顏色都使用白色文字以確保可讀性
            const textColor = TEXT_COLORS.light

            // 截斷過長的名稱
            const displayName = item.name.length > 4
                ? item.name.slice(0, 3) + '..'
                : item.name

            return {
                path,
                fillColor,
                textColor,
                textX,
                textY,
                textRotation: midAngle + 90,
                displayName,
                id: `${item.id}-${index}`,
            }
        })
    })

    // 計算旋轉粒子的位置
    const getParticlePosition = (index: number) => {
        const angle = index * 60
        const rad = (angle * Math.PI) / 180
        return {
            top: `${50 + 42 * Math.sin(rad)}%`,
            left: `${50 + 42 * Math.cos(rad)}%`,
        }
    }

    return {
        displayItems,
        segments,
        getParticlePosition,
        FESTIVE_COLORS,
        DISPLAY_SEGMENTS,
    }
}
