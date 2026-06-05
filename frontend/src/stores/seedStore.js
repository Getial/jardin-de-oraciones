import { create } from 'zustand'
import { api } from '../services/api'
import { supabase } from '../lib/supabase'

const useSeedStore = create((set, get) => ({
  seeds: [],
  loading: false,
  error: null,

  fetchSeeds: async (gardenId) => {
    set({ loading: true, error: null })
    try {
      const seeds = await api.get(`/api/gardens/${gardenId}/seeds/`)
      set({ seeds, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  createSeed: async (data) => {
    const seed = await api.post('/api/seeds/', data)
    set((state) => ({ seeds: [seed, ...state.seeds] }))
    return seed
  },

  praySeed: async (seedId) => {
    const result = await api.post(`/api/seeds/${seedId}/pray/`)
    set((state) => ({
      seeds: state.seeds.map((seed) =>
        seed.id === seedId
          ? { ...seed, pray_count: result.pray_count, has_prayed: result.prayed }
          : seed
      ),
    }))
    return result
  },

  answerSeed: async (seedId) => {
    const answered = await api.post(`/api/seeds/${seedId}/answer/`)
    set((state) => ({
      seeds: state.seeds.map((seed) => (seed.id === seedId ? answered : seed)),
    }))
    return answered
  },

  deleteSeed: async (seedId) => {
    await api.delete(`/api/seeds/${seedId}/`)
    set((state) => ({ seeds: state.seeds.filter((seed) => seed.id !== seedId) }))
  },

  // Suscripción Realtime — retorna función para cancelar
  subscribeToGarden: (gardenId) => {
    const channel = supabase
      .channel(`garden-seeds-${gardenId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seeds_seed',
          filter: `garden_id=eq.${gardenId}`,
        },
        () => {
          // Re-fetch para obtener datos serializados correctos (has_prayed, author_name…)
          get().fetchSeeds(gardenId)
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  },

  clearSeeds: () => set({ seeds: [], error: null }),
}))

export default useSeedStore
