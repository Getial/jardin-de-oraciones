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

// El crecimiento se mide en "puntos" (growth_points) que se acumulan al orar
// (1 punto base + bonificación por racha). Nunca bajan.
const GROWTH_STAGES = [
  { max: 0,        stage: 0, label: 'Tierra' },
  { max: 3,        stage: 1, label: 'Semilla' },
  { max: 9,        stage: 2, label: 'Brote' },
  { max: 19,       stage: 3, label: 'Planta' },
  { max: 39,       stage: 4, label: 'Flor' },
  { max: 79,       stage: 5, label: 'Árbol' },
  { max: Infinity, stage: 6, label: 'Árbol especial' },
]

// Etapa mínima que alcanza una oración respondida (Flor)
export const ANSWERED_MIN_STAGE = 4

export function getGrowthStage(points) {
  return GROWTH_STAGES.find((s) => points <= s.max) ?? GROWTH_STAGES[GROWTH_STAGES.length - 1]
}

// Etapa final considerando el estado (respondida → al menos Flor)
export function getPlantStage(seed) {
  const base = getGrowthStage(seed.growth_points ?? 0).stage
  return seed.state === 'answered' ? Math.max(base, ANSWERED_MIN_STAGE) : base
}

export function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  return `hace ${Math.floor(diff / 86400)}d`
}
