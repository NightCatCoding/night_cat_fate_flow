import {createApp} from 'vue'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import './assets/main.css'

// Create app
const app = createApp(App)

// Setup Pinia with persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

// Mount app and remove loading screen
app.mount('#app')

// Remove loading screen after mount
const loadingEl = document.getElementById('app-loading')
if (loadingEl) {
    loadingEl.style.opacity = '0'
    loadingEl.style.transition = 'opacity 0.3s ease-out'
    setTimeout(() => {
        loadingEl.remove()
    }, 300)
}
