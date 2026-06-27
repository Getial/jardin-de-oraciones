// Luciérnagas: puntos que flotan y parpadean por todo el jardín (solo de noche).
// Las posiciones se generan una vez al cargar el módulo (fuera del render, para
// no romper la pureza de React) y quedan fijas durante la sesión.
const FLIES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  top: 8 + Math.random() * 84, // 8–92%
  left: 4 + Math.random() * 92, // 4–96%
  size: 2 + Math.random() * 3, // 2–5px
  floatDur: 6 + Math.random() * 6, // 6–12s
  glowDur: 2.5 + Math.random() * 3, // 2.5–5.5s
  delay: Math.random() * 6,
}))

export default function Fireflies() {
  return (
    <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
      {FLIES.map((f) => (
        <span
          key={f.id}
          className="absolute rounded-full"
          style={{
            top: `${f.top}%`,
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            background: 'rgba(225,255,170,0.95)',
            boxShadow: '0 0 6px 2px rgba(205,255,130,0.65)',
            opacity: 0,
            animation: `fireflyFloat ${f.floatDur}s ease-in-out ${f.delay}s infinite, fireflyGlow ${f.glowDur}s ease-in-out ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
