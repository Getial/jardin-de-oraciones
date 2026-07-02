import { create } from 'zustand'
import { api } from '../services/api'

const useGardenStore = create((set) => ({
  gardens: [],
  loading: false,
  error: null,

  fetchGardens: async () => {
    set({ loading: true, error: null })
    try {
      const data = await api.get('/api/gardens/')
      set({ gardens: data })
    } catch (e) {
      set({ error: e.message })
    } finally {
      set({ loading: false })
    }
  },

  createGarden: async (payload) => {
    const garden = await api.post('/api/gardens/', payload)
    set((s) => ({ gardens: [garden, ...s.gardens] }))
    return garden
  },

  updateGarden: async (id, payload) => {
    const updated = await api.patch(`/api/gardens/${id}/`, payload)
    set((s) => ({ gardens: s.gardens.map((g) => (g.id === id ? updated : g)) }))
    return updated
  },

  leaveGarden: async (id) => {
    await api.post(`/api/gardens/${id}/leave/`)
    set((s) => ({ gardens: s.gardens.filter((g) => g.id !== id) }))
  },

  deleteGarden: async (id) => {
    await api.delete(`/api/gardens/${id}/`)
    set((s) => ({ gardens: s.gardens.filter((g) => g.id !== id) }))
  },

  getInvitation: async (gardenId) => {
    return api.get(`/api/gardens/${gardenId}/invite/`)
  },

  joinGarden: async (code) => {
    const garden = await api.post('/api/gardens/join/', { code })
    set((s) => ({ gardens: [...s.gardens, garden] }))
    return garden
  },
}))

export default useGardenStore
