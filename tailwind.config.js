/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // ============================================
                // Night Cat IP - Soft Cyber-Noir Theme
                // "Bioluminescent Glow" not "Laser Sharp"
                // ============================================

                // Organic Dark Backgrounds (Warm, not cold)
                'night': {
                    'void': '#0c1222',        // Deep organic dark (warm undertone)
                    'deep': '#0f172a',        // Slate-900 - Main background
                    'surface': '#1e293b',     // Slate-800 - Card surfaces
                    'elevated': '#334155',    // Slate-700 - Elevated elements
                    'border': '#475569',      // Slate-600 - Visible borders
                    'muted': '#64748b',       // Slate-500 - Muted elements
                },

                // Cat IP Colors (Soft Bioluminescent) - Dynamic via CSS Variables
                'cat': {
                    'eye': 'rgb(var(--cat-eye, 45, 212, 191))',         // Dynamic theme color
                    'glow': 'rgb(var(--cat-glow, 20, 184, 166))',       // Deeper glow
                    'spark': 'rgb(var(--cat-spark, 94, 234, 212))',     // Highlights
                    'fur': '#334155',         // Slate-700 - Dark grey fur
                    'fur-light': '#475569',   // Slate-600 - Lighter fur
                    'fur-dark': '#1e293b',    // Slate-800 - Shadow fur
                },

                // Accent System
                'accent': {
                    'primary': '#2dd4bf',     // Teal-400 - Primary actions
                    'secondary': '#14b8a6',   // Teal-500 - Secondary
                    'warm': '#fbbf24',        // Amber-400 - Warm highlights
                    'success': '#34d399',     // Emerald-400
                    'warning': '#fbbf24',     // Amber-400
                    'danger': '#f87171',      // Red-400
                },

                // Text System (Readable on dark)
                'txt': {
                    'primary': '#f1f5f9',     // Slate-100 - Primary text
                    'secondary': '#cbd5e1',   // Slate-300 - Secondary text
                    'muted': '#94a3b8',       // Slate-400 - Muted text
                    'inverse': '#0f172a',     // Slate-900 - Text on light bg
                },

                // Glass effect colors
                'glass': {
                    'white': 'rgba(255, 255, 255, 0.05)',
                    'border': 'rgba(255, 255, 255, 0.1)',
                    'highlight': 'rgba(255, 255, 255, 0.15)',
                },
            },

            fontFamily: {
                display: ['Cinzel', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },

            fontSize: {
                // Slightly larger for better dark mode readability
                'xs': ['0.8125rem', {lineHeight: '1.25rem'}],
                'sm': ['0.9375rem', {lineHeight: '1.375rem'}],
                'base': ['1.0625rem', {lineHeight: '1.625rem'}],
            },

            fontWeight: {
                // Bump up weights for dark mode
                normal: '450',
                medium: '550',
                semibold: '650',
                bold: '750',
            },

            borderRadius: {
                'pill': '9999px',
                'squircle': '24px',
                '4xl': '32px',
                '5xl': '40px',
            },

            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },

            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'float-lazy': 'floatLazy 10s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'breathe': 'breathe 4s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-down': 'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'bounce-soft': 'bounceSoft 0.6s ease-out',
                'wiggle': 'wiggle 0.5s ease-in-out',
                'blink-lazy': 'blinkLazy 5s ease-in-out infinite',
                'tail-lazy': 'tailLazy 3s ease-in-out infinite',
                'speech-pop': 'speechPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            },

            keyframes: {
                float: {
                    '0%, 100%': {transform: 'translateY(0)'},
                    '50%': {transform: 'translateY(-12px)'},
                },
                floatLazy: {
                    '0%, 100%': {transform: 'translateY(0) rotate(-1deg)'},
                    '50%': {transform: 'translateY(-8px) rotate(1deg)'},
                },
                pulseSoft: {
                    '0%, 100%': {opacity: '0.7', transform: 'scale(1)'},
                    '50%': {opacity: '1', transform: 'scale(1.02)'},
                },
                glow: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(45, 212, 191, 0.2), 0 0 40px rgba(45, 212, 191, 0.1)',
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(45, 212, 191, 0.4), 0 0 60px rgba(45, 212, 191, 0.2)',
                    },
                },
                breathe: {
                    '0%, 100%': {transform: 'scale(1)'},
                    '50%': {transform: 'scale(1.03)'},
                },
                slideUp: {
                    from: {opacity: '0', transform: 'translateY(24px)'},
                    to: {opacity: '1', transform: 'translateY(0)'},
                },
                slideDown: {
                    from: {opacity: '0', transform: 'translateY(-24px)'},
                    to: {opacity: '1', transform: 'translateY(0)'},
                },
                fadeIn: {
                    from: {opacity: '0'},
                    to: {opacity: '1'},
                },
                bounceSoft: {
                    '0%': {transform: 'scale(0.95)'},
                    '50%': {transform: 'scale(1.02)'},
                    '100%': {transform: 'scale(1)'},
                },
                wiggle: {
                    '0%, 100%': {transform: 'rotate(-2deg)'},
                    '50%': {transform: 'rotate(2deg)'},
                },
                blinkLazy: {
                    '0%, 42%, 44%, 100%': {transform: 'scaleY(1)'},
                    '43%': {transform: 'scaleY(0.1)'},
                },
                tailLazy: {
                    '0%, 100%': {transform: 'rotate(-3deg)'},
                    '50%': {transform: 'rotate(3deg)'},
                },
                speechPop: {
                    '0%': {opacity: '0', transform: 'scale(0.8) translateY(8px)'},
                    '100%': {opacity: '1', transform: 'scale(1) translateY(0)'},
                },
            },

            boxShadow: {
                // Soft glows (Bioluminescent, not laser)
                'glow-sm': '0 0 15px rgba(45, 212, 191, 0.15)',
                'glow': '0 0 25px rgba(45, 212, 191, 0.2), 0 0 50px rgba(45, 212, 191, 0.1)',
                'glow-lg': '0 0 40px rgba(45, 212, 191, 0.3), 0 0 80px rgba(45, 212, 191, 0.15)',
                'glow-warm': '0 0 25px rgba(251, 191, 36, 0.2), 0 0 50px rgba(251, 191, 36, 0.1)',

                // Glass shadows
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',

                // Soft inner glow
                'inner-glow': 'inset 0 0 40px rgba(45, 212, 191, 0.05)',
                'inner-warm': 'inset 0 0 40px rgba(251, 191, 36, 0.05)',
            },

            backdropBlur: {
                'xs': '2px',
                '3xl': '64px',
            },

            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-soft': 'linear-gradient(135deg, var(--tw-gradient-stops))',
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            },

            // Safe area support for mobile devices
            padding: {
                'safe-top': 'env(safe-area-inset-top)',
                'safe-bottom': 'env(safe-area-inset-bottom)',
                'safe-left': 'env(safe-area-inset-left)',
                'safe-right': 'env(safe-area-inset-right)',
            },

            // ============================================
            // 響應式斷點策略
            // ============================================
            // xs:  475px  - 超小屏幕微調
            // sm:  640px  - 小屏幕（大手機）
            // md:  768px  - 主要斷點：Mobile vs Desktop
            //              - Header/Footer 切換
            //              - 底部導航 vs 頂部導航
            //              - 固定按鈕 vs 內聯按鈕
            // lg:  1024px - 次要斷點：雙欄 vs 三欄布局
            //              - History 面板顯示/隱藏
            //              - Mascot 位置調整
            // xl:  1280px - 大屏幕優化
            // 2xl: 1536px - 超大屏幕
            // ============================================
            screens: {
                'xs': '475px',
                // 保留 Tailwind 預設斷點: sm:640, md:768, lg:1024, xl:1280, 2xl:1536
            },
        },
    },
    plugins: [],
}
