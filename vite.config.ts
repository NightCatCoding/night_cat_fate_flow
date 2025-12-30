import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 確保這樣引入

export default defineConfig({
    plugins: [vue()],
    base: '/night_cat_fate_flow/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        // CSS 代碼分割
        cssCodeSplit: true,
        // Chunk 大小警告閾值 (kB)
        chunkSizeWarningLimit: 500,
        terserOptions: {
            compress: {
                // 移除 console.log（保留 warn/error）
                drop_console: ['log'],
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                // 更細緻的 chunk 分割策略
                manualChunks: {
                    // Vue 核心
                    'vue-core': ['vue', 'vue-router'],
                    // 狀態管理
                    'state': ['pinia', 'pinia-plugin-persistedstate'],
                    // 工具庫
                    'utils': ['@vueuse/core'],
                    // Excel 處理（較大，單獨分割）
                    'excel': ['xlsx'],
                    // UI 相關
                    'ui-vendor': ['@headlessui/vue', 'lucide-vue-next'],
                    // 特效
                    'effects': ['canvas-confetti'],
                },
                // 優化 chunk 命名
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
    },
    // 開發服務器優化
    server: {
        open: true,
        // 預熱常用依賴
        warmup: {
            clientFiles: [
                './src/components/**/*.vue',
                './src/views/**/*.vue',
            ],
        },
    },
    // 依賴優化
    optimizeDeps: {
        include: [
            'vue',
            'pinia',
            'vue-router',
            '@vueuse/core',
            'lucide-vue-next',
        ],
    },
})
