import { create } from 'zustand'

const STORAGE_KEY = 'jardin-theme'

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false
}

function applyTheme(mode) {
  const isDark = mode === 'dark' || (mode === 'auto' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', isDark)
}

let mediaQuery = null

const useThemeStore = create((set, get) => ({
  mode: 'auto', // 'auto' | 'light' | 'dark'

  init: () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const mode = saved === 'light' || saved === 'dark' || saved === 'auto' ? saved : 'auto'
    set({ mode })
    applyTheme(mode)

    // En modo automático, seguir los cambios de preferencia del sistema
    if (!mediaQuery && window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (get().mode === 'auto') applyTheme('auto')
      })
    }
  },

  setMode: (mode) => {
    localStorage.setItem(STORAGE_KEY, mode)
    set({ mode })
    applyTheme(mode)
  },
}))

export default useThemeStore
