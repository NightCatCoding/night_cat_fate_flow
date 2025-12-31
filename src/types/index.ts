// Core data types for Night Cat Serendipity

export interface Item {
    id: string
    name: string
    hasWon: boolean
    createdAt: number
}

export interface Category {
    id: string
    name: string
    themeColor: ThemeColor
    items: Item[]
    createdAt: number
    updatedAt: number
}

export type ThemeColor =
    | 'blue'
    | 'purple'
    | 'pink'
    | 'gold'
    | 'cyan'
    | 'emerald'

export interface DrawResult {
    id: string
    categoryId: string
    categoryName: string
    winners: Item[]
    timestamp: number
    themeColor: ThemeColor
}

export interface GlobalSettings {
    spinDuration: number  // 1-10 秒
    removeAfterWin: boolean
    language: 'zh' | 'en'
    confettiDuration: number  // 1-10 秒
}