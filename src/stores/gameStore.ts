import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import type {Category, DrawResult, GlobalSettings, Item, ThemeColor} from '@/types'

const generateId = () => crypto.randomUUID()

export const useGameStore = defineStore('game', () => {
    // State
    const categories = ref<Category[]>([])
    const currentCategoryId = ref<string | null>(null)
    const history = ref<DrawResult[]>([])
    const settings = ref<GlobalSettings>({
        spinDuration: 5,  // 默认5秒
        removeAfterWin: true,
        language: 'zh',
        confettiDuration: 5,  // 默认5秒
    })

    // Getters
    const currentCategory = computed(() =>
        categories.value.find(c => c.id === currentCategoryId.value) || null
    )

    const availableItems = computed(() => {
        if (!currentCategory.value) return []
        return currentCategory.value.items.filter(item => !item.hasWon)
    })

    const wonItems = computed(() => {
        if (!currentCategory.value) return []
        return currentCategory.value.items.filter(item => item.hasWon)
    })

    const getCategoryById = (id: string) =>
        categories.value.find(c => c.id === id)

    const getCategoryStats = (categoryId: string) => {
        const category = getCategoryById(categoryId)
        if (!category) return {total: 0, remaining: 0, won: 0}
        const total = category.items.length
        const won = category.items.filter(i => i.hasWon).length
        return {total, remaining: total - won, won}
    }

    // Actions - Categories
    const createCategory = (name: string, themeColor: ThemeColor = 'blue'): Category => {
        const now = Date.now()
        const newCategory: Category = {
            id: generateId(),
            name,
            themeColor,
            items: [],
            createdAt: now,
            updatedAt: now,
        }
        categories.value.push(newCategory)
        return newCategory
    }

    const updateCategory = (id: string, updates: Partial<Pick<Category, 'name' | 'themeColor'>>) => {
        const index = categories.value.findIndex(c => c.id === id)
        if (index !== -1) {
            categories.value[index] = {
                ...categories.value[index],
                ...updates,
                updatedAt: Date.now(),
            }
        }
    }

    const deleteCategory = (id: string) => {
        const index = categories.value.findIndex(c => c.id === id)
        if (index !== -1) {
            categories.value.splice(index, 1)
            if (currentCategoryId.value === id) {
                currentCategoryId.value = categories.value[0]?.id || null
            }
        }
    }

    const setCurrentCategory = (id: string | null) => {
        currentCategoryId.value = id
    }

    // Actions - Items
    const addItem = (categoryId: string, name: string): Item | null => {
        const category = getCategoryById(categoryId)
        if (!category) return null

        const newItem: Item = {
            id: generateId(),
            name: name.trim(),
            hasWon: false,
            createdAt: Date.now(),
        }
        category.items.push(newItem)
        category.updatedAt = Date.now()
        return newItem
    }

    const addBulkItems = (categoryId: string, names: string[]): Item[] => {
        const addedItems: Item[] = []
        names.forEach(name => {
            const trimmed = name.trim()
            if (trimmed) {
                const item = addItem(categoryId, trimmed)
                if (item) addedItems.push(item)
            }
        })
        return addedItems
    }

    const updateItem = (categoryId: string, itemId: string, updates: Partial<Pick<Item, 'name' | 'hasWon'>>) => {
        const category = getCategoryById(categoryId)
        if (!category) return

        const itemIndex = category.items.findIndex(i => i.id === itemId)
        if (itemIndex !== -1) {
            category.items[itemIndex] = {
                ...category.items[itemIndex],
                ...updates,
            }
            category.updatedAt = Date.now()
        }
    }

    const deleteItem = (categoryId: string, itemId: string) => {
        const category = getCategoryById(categoryId)
        if (!category) return

        const index = category.items.findIndex(i => i.id === itemId)
        if (index !== -1) {
            category.items.splice(index, 1)
            category.updatedAt = Date.now()
        }
    }

    const resetCategoryWinners = (categoryId: string) => {
        const category = getCategoryById(categoryId)
        if (!category) return

        category.items.forEach(item => {
            item.hasWon = false
        })
        category.updatedAt = Date.now()
    }

    // Actions - Drawing

    // 預選中獎者（不修改狀態，只返回將要中獎的人）
    const preSelectWinners = (categoryId: string, count: number): Item[] => {
        const category = getCategoryById(categoryId)
        if (!category) return []

        const pool = category.items.filter(item => !item.hasWon)
        if (pool.length === 0) return []

        const actualCount = Math.min(count, pool.length)

        // Fisher-Yates shuffle
        const shuffled = [...pool]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }

        return shuffled.slice(0, actualCount)
    }

    // 確認中獎者（標記狀態、記錄歷史）
    const confirmWinners = (categoryId: string, winners: Item[]): void => {
        const category = getCategoryById(categoryId)
        if (!category || winners.length === 0) return

        // Mark winners
        if (settings.value.removeAfterWin) {
            winners.forEach(winner => {
                const itemIndex = category.items.findIndex(i => i.id === winner.id)
                if (itemIndex !== -1) {
                    category.items[itemIndex].hasWon = true
                }
            })
        }

        // Record to history
        const result: DrawResult = {
            id: generateId(),
            categoryId,
            categoryName: category.name,
            winners: [...winners],
            timestamp: Date.now(),
            themeColor: category.themeColor,
        }
        history.value.unshift(result)

        category.updatedAt = Date.now()
    }

    const performDraw = (categoryId: string, count: number): Item[] => {
        const category = getCategoryById(categoryId)
        if (!category) return []

        const pool = category.items.filter(item => !item.hasWon)
        if (pool.length === 0) return []

        const actualCount = Math.min(count, pool.length)

        // Fisher-Yates shuffle
        const shuffled = [...pool]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }

        const winners = shuffled.slice(0, actualCount)

        // Mark winners
        if (settings.value.removeAfterWin) {
            winners.forEach(winner => {
                const itemIndex = category.items.findIndex(i => i.id === winner.id)
                if (itemIndex !== -1) {
                    category.items[itemIndex].hasWon = true
                }
            })
        }

        // Record to history
        const result: DrawResult = {
            id: generateId(),
            categoryId,
            categoryName: category.name,
            winners: [...winners],
            timestamp: Date.now(),
            themeColor: category.themeColor,
        }
        history.value.unshift(result)

        category.updatedAt = Date.now()
        return winners
    }

    // Actions - Settings
    const updateSettings = (updates: Partial<GlobalSettings>) => {
        settings.value = {...settings.value, ...updates}
    }

    // Actions - History
    const clearHistory = () => {
        history.value = []
    }

    // Actions - Data Management
    const exportData = () => {
        return {
            categories: categories.value,
            history: history.value,
            settings: settings.value,
            exportedAt: Date.now(),
            version: '1.0.0',
        }
    }

    const importData = (data: ReturnType<typeof exportData>) => {
        if (data.categories) {
            categories.value = data.categories
        }
        if (data.history) {
            history.value = data.history
        }
        if (data.settings) {
            settings.value = {...settings.value, ...data.settings}
        }
        currentCategoryId.value = categories.value[0]?.id || null
    }

    const resetAllData = () => {
        categories.value = []
        history.value = []
        currentCategoryId.value = null
    }

    // Initialize with default category if empty
    const initializeDefaultCategory = () => {
        if (categories.value.length === 0) {
            const defaultCategory = createCategory('默认分组', 'blue')
            currentCategoryId.value = defaultCategory.id
        } else if (!currentCategoryId.value) {
            currentCategoryId.value = categories.value[0].id
        }
    }

    return {
        // State
        categories,
        currentCategoryId,
        history,
        settings,

        // Getters
        currentCategory,
        availableItems,
        wonItems,
        getCategoryById,
        getCategoryStats,

        // Actions - Categories
        createCategory,
        updateCategory,
        deleteCategory,
        setCurrentCategory,

        // Actions - Items
        addItem,
        addBulkItems,
        updateItem,
        deleteItem,
        resetCategoryWinners,

        // Actions - Drawing
        preSelectWinners,
        confirmWinners,
        performDraw,

        // Actions - Settings
        updateSettings,

        // Actions - History
        clearHistory,

        // Actions - Data Management
        exportData,
        importData,
        resetAllData,
        initializeDefaultCategory,
    }
}, {
    persist: {
        key: 'night-cat-fate-flow',
    },
})
