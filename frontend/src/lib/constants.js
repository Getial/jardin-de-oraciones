export const GARDEN_META = {
  personal:     { emoji: '🌱', label: 'Personal',         bg: '#EDF2E8' },
  couple:       { emoji: '❤️',  label: 'Pareja',           bg: '#FAEDEE' },
  family:       { emoji: '👨‍👩‍👧', label: 'Familia',          bg: '#FDF3E7' },
  friends:      { emoji: '🫂',  label: 'Amigos',           bg: '#EBF0F8' },
  prayer_group: { emoji: '🙏',  label: 'Grupo de oración', bg: '#F3EDF8' },
}

export const SEED_TYPES = [
  { key: 'prayer',         emoji: '🙏', label: 'Petición',        desc: 'Una oración o petición al Señor' },
  { key: 'message',        emoji: '💌', label: 'Mensaje',          desc: 'Un mensaje para el jardín' },
  { key: 'verse',          emoji: '📖', label: 'Versículo',        desc: 'Una palabra de las Escrituras' },
  { key: 'gratitude',      emoji: '🙌', label: 'Gratitud',         desc: 'Algo por lo que das gracias' },
  { key: 'special_moment', emoji: '✨', label: 'Momento especial', desc: 'Un momento para recordar' },
]

const GROWTH_STAGES = [
  { max: 0,        emoji: '🌱',   label: 'Semilla' },
  { max: 3,        emoji: '🌿',   label: 'Brote' },
  { max: 8,        emoji: '🌸',   label: 'Floreciendo' },
  { max: 15,       emoji: '🌳',   label: 'Árbol' },
  { max: Infinity, emoji: '🌳✨', label: 'Árbol especial' },
]

export function getGrowthStage(prayCount) {
  return GROWTH_STAGES.find((s) => prayCount <= s.max) ?? GROWTH_STAGES[GROWTH_STAGES.length - 1]
}

export function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  return `hace ${Math.floor(diff / 86400)}d`
}
