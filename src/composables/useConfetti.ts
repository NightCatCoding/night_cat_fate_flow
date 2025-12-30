import confetti from 'canvas-confetti'
import type {ThemeColor} from '@/types'
import {useGameStore} from '@/stores'

// 彩花 z-index - 设在背景遮罩(z-90)之上，Modal内容(z-100)之下
const CONFETTI_Z_INDEX = 95

// 更丰富的颜色映射 - 每个主题包含主色、辅色、金色点缀
const colorMap: Record<ThemeColor, string[]> = {
    blue: ['#38bdf8', '#0ea5e9', '#7dd3fc', '#bae6fd', '#fbbf24', '#fef3c7'],
    purple: ['#a855f7', '#c084fc', '#d8b4fe', '#9333ea', '#f472b6', '#fbbf24'],
    pink: ['#ec4899', '#f472b6', '#fb7185', '#fda4af', '#fbbf24', '#c084fc'],
    gold: ['#fbbf24', '#fcd34d', '#fef08a', '#f59e0b', '#fb923c', '#f8fafc'],
    cyan: ['#22d3ee', '#2dd4bf', '#5eead4', '#67e8f9', '#a5f3fc', '#fbbf24'],
    emerald: ['#34d399', '#4ade80', '#86efac', '#10b981', '#fbbf24', '#a5f3fc'],
}

// 彩虹色 - 用于超级庆祝
const RAINBOW_COLORS = [
    '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff',
    '#5f27cd', '#00d2d3', '#1dd1a1', '#ffeaa7', '#fd79a8',
]

// 金色系 - 豪华感
const GOLD_SPARKLE = ['#fbbf24', '#fcd34d', '#fef08a', '#f59e0b', '#fef3c7', '#fffbeb']

export function useConfetti() {
    const gameStore = useGameStore()

    // 获取当前洒花持续时间设定（秒 -> 毫秒）
    const getDuration = () => {
        return (gameStore.settings.confettiDuration || 5) * 1000
    }

    /**
     * 基础彩花爆发
     */
    const fireConfetti = (themeColor: ThemeColor = 'cyan') => {
        const colors = colorMap[themeColor]

        // 中央大爆发
        confetti({
            particleCount: 150,
            spread: 100,
            origin: {y: 0.6},
            colors,
            startVelocity: 45,
            gravity: 0.8,
            ticks: 300,
            zIndex: CONFETTI_Z_INDEX,
        })

        // 左侧发射
        setTimeout(() => {
            confetti({
                particleCount: 80,
                angle: 60,
                spread: 70,
                origin: {x: 0, y: 0.7},
                colors,
                startVelocity: 55,
                zIndex: CONFETTI_Z_INDEX,
            })
        }, 150)

        // 右侧发射
        setTimeout(() => {
            confetti({
                particleCount: 80,
                angle: 120,
                spread: 70,
                origin: {x: 1, y: 0.7},
                colors,
                startVelocity: 55,
                zIndex: CONFETTI_Z_INDEX,
            })
        }, 150)

        // 金色点缀（延迟）
        setTimeout(() => {
            confetti({
                particleCount: 30,
                spread: 360,
                origin: {y: 0.5, x: 0.5},
                colors: GOLD_SPARKLE,
                startVelocity: 25,
                gravity: 0.5,
                scalar: 1.2,
                ticks: 200,
                zIndex: CONFETTI_Z_INDEX,
            })
        }, 400)
    }

    /**
     * 星星爆发效果
     */
    const fireStars = (themeColor: ThemeColor = 'gold') => {
        const colors = colorMap[themeColor]

        // 中心星星爆发
        confetti({
            particleCount: 60,
            spread: 360,
            ticks: 150,
            gravity: 0.2,
            decay: 0.92,
            startVelocity: 35,
            shapes: ['star'],
            colors: [...colors, ...GOLD_SPARKLE],
            origin: {x: 0.5, y: 0.5},
            scalar: 1.3,
            zIndex: CONFETTI_Z_INDEX,
        })

        // 小星星散落
        setTimeout(() => {
            confetti({
                particleCount: 40,
                spread: 180,
                ticks: 120,
                gravity: 0.4,
                startVelocity: 25,
                shapes: ['star'],
                colors: GOLD_SPARKLE,
                origin: {x: 0.5, y: 0.4},
                scalar: 0.8,
                zIndex: CONFETTI_Z_INDEX,
            })
        }, 200)
    }

    /**
     * 豪华庆祝效果 - 中奖专用
     */
    const fireCelebration = (themeColor: ThemeColor = 'cyan') => {
        const duration = getDuration()
        const animationEnd = Date.now() + duration
        const colors = [...colorMap[themeColor], ...GOLD_SPARKLE]

        // 初始大爆发
        confetti({
            particleCount: 200,
            spread: 120,
            origin: {y: 0.55},
            colors: RAINBOW_COLORS,
            startVelocity: 50,
            gravity: 0.7,
            ticks: 400,
            zIndex: CONFETTI_Z_INDEX,
        })

        // 星星爆发
        setTimeout(() => {
            confetti({
                particleCount: 80,
                spread: 360,
                shapes: ['star'],
                colors: GOLD_SPARKLE,
                origin: {x: 0.5, y: 0.5},
                startVelocity: 40,
                gravity: 0.3,
                scalar: 1.5,
                ticks: 200,
                zIndex: CONFETTI_Z_INDEX,
            })
        }, 300)

        // 持续的侧边发射
        const frame = () => {
            const timeLeft = animationEnd - Date.now()

            // 根据剩余时间调整粒子数
            const particleCount = Math.max(2, Math.floor(timeLeft / 500))

            confetti({
                particleCount,
                angle: 60,
                spread: 60,
                origin: {x: 0, y: 0.7},
                colors,
                startVelocity: 45,
                gravity: 1,
                zIndex: CONFETTI_Z_INDEX,
            })

            confetti({
                particleCount,
                angle: 120,
                spread: 60,
                origin: {x: 1, y: 0.7},
                colors,
                startVelocity: 45,
                gravity: 1,
                zIndex: CONFETTI_Z_INDEX,
            })

            if (Date.now() < animationEnd) {
                requestAnimationFrame(frame)
            }
        }

        // 延迟开始持续发射
        setTimeout(frame, 500)

        // 中间补充爆发
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 100,
                origin: {y: 0.6, x: 0.5},
                colors: RAINBOW_COLORS,
                startVelocity: 40,
                zIndex: CONFETTI_Z_INDEX,
            })
        }, duration * 0.4)

        // 最后金色收尾
        setTimeout(() => {
            confetti({
                particleCount: 50,
                spread: 360,
                shapes: ['star', 'circle'],
                colors: GOLD_SPARKLE,
                origin: {x: 0.5, y: 0.5},
                startVelocity: 30,
                gravity: 0.4,
                scalar: 1.2,
                ticks: 150,
                zIndex: CONFETTI_Z_INDEX,
            })
        }, duration * 0.9)
    }

    /**
     * 彩虹瀑布效果 - 超级大奖专用
     */
    const fireRainbow = () => {
        const duration = getDuration()
        const animationEnd = Date.now() + duration

        // 大型彩虹爆发
        confetti({
            particleCount: 250,
            spread: 180,
            origin: {y: 0.4},
            colors: RAINBOW_COLORS,
            startVelocity: 55,
            gravity: 0.6,
            ticks: 500,
            zIndex: CONFETTI_Z_INDEX,
        })

        // 左右交替发射
        let side = 0
        const frame = () => {
            side = 1 - side // 交替

            confetti({
                particleCount: 5,
                angle: side ? 60 : 120,
                spread: 50,
                origin: {x: side ? 0 : 1, y: 0.6},
                colors: RAINBOW_COLORS,
                startVelocity: 50,
                gravity: 0.9,
                shapes: ['circle', 'square'],
                zIndex: CONFETTI_Z_INDEX,
            })

            // 金色点缀
            if (Math.random() > 0.7) {
                confetti({
                    particleCount: 3,
                    spread: 360,
                    origin: {x: Math.random(), y: Math.random() * 0.5 + 0.2},
                    colors: GOLD_SPARKLE,
                    shapes: ['star'],
                    startVelocity: 20,
                    gravity: 0.3,
                    scalar: 1.5,
                    zIndex: CONFETTI_Z_INDEX,
                })
            }

            if (Date.now() < animationEnd) {
                requestAnimationFrame(frame)
            }
        }

        frame()

        // 周期性大爆发 - 根据总时长动态计算
        const burstCount = Math.floor(duration / 1000)
        for (let i = 1; i < burstCount; i++) {
            setTimeout(() => {
                confetti({
                    particleCount: 80,
                    spread: 100,
                    origin: {y: 0.5, x: 0.3 + Math.random() * 0.4},
                    colors: RAINBOW_COLORS,
                    startVelocity: 45,
                    zIndex: CONFETTI_Z_INDEX,
                })
            }, i * 1000)
        }
    }

    /**
     * 快速闪烁效果 - 轻量级庆祝
     */
    const fireSparkle = (themeColor: ThemeColor = 'gold') => {
        const colors = [...colorMap[themeColor], ...GOLD_SPARKLE]

        // 三次快速闪烁
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: {y: 0.7, x: 0.5},
                    colors,
                    startVelocity: 30 + i * 5,
                    gravity: 1.2,
                    ticks: 100,
                    scalar: 0.9,
                    zIndex: CONFETTI_Z_INDEX,
                })
            }, i * 150)
        }
    }

    return {
        fireConfetti,
        fireStars,
        fireCelebration,
        fireRainbow,
        fireSparkle,
    }
}
