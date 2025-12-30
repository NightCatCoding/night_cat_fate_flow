import * as XLSX from 'xlsx'
import {useGameStore, useUiStore} from '@/stores'
import type {ThemeColor} from '@/types'

export function useExcel() {
    const gameStore = useGameStore()
    const uiStore = useUiStore()

    const importFromExcel = async (file: File, categoryId?: string): Promise<{
        success: boolean;
        count: number;
        error?: string
    }> => {
        return new Promise((resolve) => {
            const reader = new FileReader()

            reader.onload = (evt) => {
                try {
                    const bstr = evt.target?.result
                    const workbook = XLSX.read(bstr, {type: 'binary'})
                    const sheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[sheetName]
                    const data = XLSX.utils.sheet_to_json(worksheet)

                    if (data.length === 0) {
                        resolve({success: false, count: 0, error: 'Excel 文件为空'})
                        return
                    }

                    let importedCount = 0

                    // If categoryId is provided, import to that category
                    if (categoryId) {
                        const names = data.map((row: any) => {
                            return row['姓名'] || row['Name'] || row['name'] || row['名称'] || row['项目'] || String(Object.values(row)[0] || '')
                        }).filter(Boolean)

                        const addedItems = gameStore.addBulkItems(categoryId, names)
                        importedCount = addedItems.length
                    } else {
                        // Smart import: detect categories from data
                        data.forEach((row: any) => {
                            const name = row['姓名'] || row['Name'] || row['name'] || row['名称'] || row['项目'] || ''
                            const categoryName = row['分类'] || row['Category'] || row['category'] || row['分组'] || row['类别'] || '导入数据'
                            const colorRaw = row['颜色'] || row['Color'] || row['color'] || ''

                            if (!name) return

                            // Find or create category
                            let category = gameStore.categories.find(c => c.name === categoryName)
                            if (!category) {
                                const color = parseColor(colorRaw)
                                category = gameStore.createCategory(categoryName, color)
                            }

                            gameStore.addItem(category.id, String(name).trim())
                            importedCount++
                        })
                    }

                    resolve({success: true, count: importedCount})
                } catch (e) {
                    console.error('Excel import error:', e)
                    resolve({success: false, count: 0, error: '读取 Excel 文件失败'})
                }
            }

            reader.onerror = () => {
                resolve({success: false, count: 0, error: '读取文件失败'})
            }

            reader.readAsBinaryString(file)
        })
    }

    const parseColor = (colorStr: string): ThemeColor => {
        const str = colorStr.toLowerCase()
        if (str.includes('blue') || str.includes('蓝')) return 'blue'
        if (str.includes('purple') || str.includes('紫')) return 'purple'
        if (str.includes('pink') || str.includes('粉')) return 'pink'
        if (str.includes('gold') || str.includes('金') || str.includes('黄')) return 'gold'
        if (str.includes('cyan') || str.includes('青')) return 'cyan'
        if (str.includes('green') || str.includes('绿')) return 'emerald'
        return 'blue'
    }

    const exportToExcel = (categoryId?: string) => {
        const categories = categoryId
            ? gameStore.categories.filter(c => c.id === categoryId)
            : gameStore.categories

        if (categories.length === 0) {
            uiStore.addToast('没有可导出的数据', 'warning')
            return
        }

        const data: any[] = []

        categories.forEach(category => {
            category.items.forEach(item => {
                data.push({
                    '分类': category.name,
                    '颜色': category.themeColor,
                    '姓名': item.name,
                    '状态': item.hasWon ? '已中奖' : '未中奖',
                })
            })
        })

        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, '抽奖名单')

        // Auto-fit column widths
        const colWidths = [
            {wch: 15}, // 分类
            {wch: 10}, // 颜色
            {wch: 20}, // 姓名
            {wch: 10}, // 状态
        ]
        worksheet['!cols'] = colWidths

        const filename = categoryId
            ? `${categories[0].name}_名单.xlsx`
            : 'NightCat_抽奖名单.xlsx'

        XLSX.writeFile(workbook, filename)
        uiStore.addToast('导出成功', 'success')
    }

    const exportHistory = () => {
        if (gameStore.history.length === 0) {
            uiStore.addToast('没有抽奖历史', 'warning')
            return
        }

        const data = gameStore.history.map(record => ({
            '时间': new Date(record.timestamp).toLocaleString(),
            '分类': record.categoryName,
            '中奖者': record.winners.map(w => w.name).join(', '),
        }))

        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, '中奖历史')

        XLSX.writeFile(workbook, 'NightCat_中奖历史.xlsx')
        uiStore.addToast('历史导出成功', 'success')
    }

    const downloadTemplate = () => {
        const templateData = [
            {'姓名': '张三', '分类': '主菜', '颜色': 'blue'},
            {'姓名': '李四', '分类': '主菜', '颜色': 'blue'},
            {'姓名': '王五', '分类': '甜点', '颜色': 'pink'},
            {'姓名': '赵六', '分类': '甜点', '颜色': 'pink'},
        ]

        const worksheet = XLSX.utils.json_to_sheet(templateData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, '导入模板')

        XLSX.writeFile(workbook, 'NightCat_导入模板.xlsx')
        uiStore.addToast('模板下载成功', 'success')
    }

    return {
        importFromExcel,
        exportToExcel,
        exportHistory,
        downloadTemplate,
    }
}
