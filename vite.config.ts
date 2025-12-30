import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: '/night_cat_fate_flow/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    // esbuild 的設定要放在這裡，與 build 平級
    esbuild: {
        // 移除 console.log 和 debugger
        drop: ['console', 'debugger'],
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        // 改用預設的 esbuild 壓縮，速度最快且不需要安裝額外套件
        minify: 'esbuild',
        cssCodeSplit: true,
        chunkSizeWarningLimit: 500,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vue-core': ['vue', 'vue-router'],
                    'state': ['pinia', 'pinia-plugin-persistedstate'],
                    'utils': ['@vueuse/core'],
                    'excel': ['xlsx'],
                    'ui-vendor': ['@headlessui/vue', 'lucide-vue-next'],
                    'effects': ['canvas-confetti'],
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
    },
    server: {
        open: true,
        warmup: {
            clientFiles: [
                './src/components/**/*.vue',
                './src/views/**/*.vue',
            ],
        },
    },
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
