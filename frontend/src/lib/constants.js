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
  { max: 0,        stage: 0, label: 'Tierra' },
  { max: 2,        stage: 1, label: 'Semilla' },
  { max: 5,        stage: 2, label: 'Brote' },
  { max: 10,       stage: 3, label: 'Planta' },
  { max: 20,       stage: 4, label: 'Flor' },
  { max: Infinity, stage: 5, label: 'Árbol' },
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
