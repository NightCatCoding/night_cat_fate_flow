// Core data types for Night Cat Fate Flow

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
    animationSpeed: 'slow' | 'normal' | 'fast'
    removeAfterWin: boolean
    language: 'zh' | 'en'
    confettiDuration: 'short' | 'normal' | 'long' | 'epic'  // 灑花持續時間
}

// Theme color mapping utilities
export const themeColorMap: Record<ThemeColor, {
    primary: string
    secondary: string
    text: string
    glow: string
    bg: string
    border: string
}> = {
    blue: {
        primary: 'bg-sky-500',
        secondary: 'bg-sky-400/20',
        text: 'text-sky-400',
        glow: 'shadow-neon-blue',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/50',
    },
    purple: {
        primary: 'bg-purple-500',
        secondary: 'bg-purple-400/20',
        text: 'text-purple-400',
        glow: 'shadow-neon-purple',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/50',
    },
    pink: {
        primary: 'bg-pink-500',
        secondary: 'bg-pink-400/20',
        text: 'text-pink-400',
        glow: 'shadow-neon-pink',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/50',
    },
    gold: {
        primary: 'bg-amber-500',
        secondary: 'bg-amber-400/20',
        text: 'text-amber-400',
        glow: 'shadow-neon-gold',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/50',
    },
    cyan: {
        primary: 'bg-cyan-500',
        secondary: 'bg-cyan-400/20',
        text: 'text-cyan-400',
        glow: 'shadow-neon-blue',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/50',
    },
    emerald: {
        primary: 'bg-emerald-500',
        secondary: 'bg-emerald-400/20',
        text: 'text-emerald-400',
        glow: 'shadow-neon-blue',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/50',
    },
}

// Get raw hex color for SVG rendering
export const themeHexColors: Record<ThemeColor, {
    primary: string
    secondary: string
    accent: string
    text: string
}> = {
    blue: {
        primary: '#38bdf8',
        secondary: '#0c4a6e',
        accent: '#fbbf24',
        text: '#0c4a6e',
    },
    purple: {
        primary: '#a855f7',
        secondary: '#3b0764',
        accent: '#fbbf24',
        text: '#3b0764',
    },
    pink: {
        primary: '#ec4899',
        secondary: '#500724',
        accent: '#fbbf24',
        text: '#500724',
    },
    gold: {
        primary: '#fbbf24',
        secondary: '#451a03',
        accent: '#f8fafc',
        text: '#451a03',
    },
    cyan: {
        primary: '#22d3ee',
        secondary: '#083344',
        accent: '#fbbf24',
        text: '#083344',
    },
    emerald: {
        primary: '#34d399',
        secondary: '#022c22',
        accent: '#fbbf24',
        text: '#022c22',
    },
}
