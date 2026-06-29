const SWAY = { transformBox: 'fill-box', transformOrigin: 'bottom center', animation: 'plantSway 3.5s ease-in-out infinite' }
const SWAY_BIG = { transformBox: 'fill-box', transformOrigin: 'bottom center', animation: 'plantSwayBig 3s ease-in-out infinite' }

// Paletas día / noche fieles a la referencia
function palette(night) {
  return night
    ? {
        soil: '#4a3622', soilTop: '#5a4530', soilDark: '#2f2214', clump: '#604a30',
        seed: '#a98545', seedHi: '#caa468',
        stem: '#3f5a2c', leafD: '#2f5226', leafM: '#3c6a30', leafL: '#4e8038',
        petal: '#b9a24a', petalC: '#9a6a2a', petalHi: '#d8c878',
        trunk: '#3f2c1a', trunkHi: '#4f3a24',
        canopyD: '#274a1f', canopyM: '#315d28', canopyL: '#3f7233', canopyHi: '#4d8540',
        blossomD: '#7a5a72', blossomM: '#9a7790', blossomL: '#b49aad', blossomDot: '#c8aec0',
      }
    : {
        soil: '#8a6a45', soilTop: '#9c7c54', soilDark: '#6e5436', clump: '#7d5e3c',
        seed: '#cba35c', seedHi: '#ecd49a',
        stem: '#5c7c3a', leafD: '#3f7a2e', leafM: '#54983c', leafL: '#72b350',
        petal: '#f4c93f', petalC: '#e8892a', petalHi: '#fbe58a',
        trunk: '#7d5836', trunkHi: '#956d47',
        canopyD: '#3f7a2e', canopyM: '#52983c', canopyL: '#6fb24c', canopyHi: '#8cc763',
        blossomD: '#e493b1', blossomM: '#f2b6cf', blossomL: '#fad7e4', blossomDot: '#ffffff',
      }
}

function Soil({ p }) {
  return (
    <g>
      <ellipse cx="50" cy="111" rx="40" ry="8" fill={p.soilDark} />
      <path d="M16,111 C16,95 30,86 50,86 C70,86 84,95 84,111 Z" fill={p.soil} />
      <ellipse cx="50" cy="89" rx="27" ry="8.5" fill={p.soilTop} />
      <circle cx="29" cy="105" r="3" fill={p.clump} />
      <circle cx="71" cy="104" r="2.6" fill={p.clump} />
      <circle cx="60" cy="107" r="2" fill={p.clump} />
    </g>
  )
}

const Svg = (props) => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} />
)

// 0 — Tierra vacía
function Tierra({ night }) {
  const p = palette(night)
  return (
    <Svg style={{ animation: 'seedGrow 0.6s ease-out' }}>
      <Soil p={p} />
      <ellipse cx="50" cy="89" rx="10" ry="3.5" fill={p.soilDark} opacity="0.7" />
    </Svg>
  )
}

// 1 — Semilla
function Semilla({ night }) {
  const p = palette(night)
  return (
    <Svg>
      <Soil p={p} />
      <ellipse cx="50" cy="89" rx="9" ry="3" fill={p.soilDark} opacity="0.7" />
      <g transform="rotate(-16 50 85)">
        <ellipse cx="50" cy="84" rx="5.5" ry="8" fill={p.seed} />
        <ellipse cx="48" cy="81" rx="1.8" ry="3" fill={p.seedHi} />
      </g>
    </Svg>
  )
}

// 2 — Brote
function Brote({ night }) {
  const p = palette(night)
  return (
    <Svg>
      <Soil p={p} />
      <g style={SWAY}>
        <path d="M50,88 C50,78 49,72 49,66" stroke={p.stem} strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="40" cy="69" rx="9" ry="4" fill={p.leafL} transform="rotate(-34 40 69)" />
        <ellipse cx="59" cy="66" rx="9" ry="4" fill={p.leafM} transform="rotate(34 59 66)" />
        <circle cx="49" cy="64" r="3" fill={p.leafL} />
      </g>
    </Svg>
  )
}

// 3 — Planta
function Planta({ night }) {
  const p = palette(night)
  return (
    <Svg>
      <Soil p={p} />
      <g style={SWAY}>
        <path d="M50,89 C50,72 49,54 49,40" stroke={p.stem} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <ellipse cx="35" cy="78" rx="13" ry="5.5" fill={p.leafM} transform="rotate(-38 35 78)" />
        <ellipse cx="64" cy="72" rx="13" ry="5.5" fill={p.leafD} transform="rotate(38 64 72)" />
        <ellipse cx="36" cy="61" rx="12" ry="5" fill={p.leafL} transform="rotate(-30 36 61)" />
        <ellipse cx="63" cy="55" rx="12" ry="5" fill={p.leafM} transform="rotate(30 63 55)" />
        {/* cogollo superior */}
        <ellipse cx="44" cy="42" rx="8" ry="4" fill={p.leafL} transform="rotate(-48 44 42)" />
        <ellipse cx="56" cy="42" rx="8" ry="4" fill={p.leafM} transform="rotate(48 56 42)" />
        <ellipse cx="49" cy="36" rx="5.5" ry="8" fill={p.leafL} />
      </g>
    </Svg>
  )
}

// 4 — Flor
function Flor({ night }) {
  const p = palette(night)
  return (
    <Svg>
      <Soil p={p} />
      <g style={SWAY_BIG}>
        <path d="M50,89 C50,74 49,58 49,46" stroke={p.stem} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <ellipse cx="36" cy="76" rx="13" ry="5.5" fill={p.leafM} transform="rotate(-38 36 76)" />
        <ellipse cx="63" cy="69" rx="13" ry="5.5" fill={p.leafD} transform="rotate(38 63 69)" />
        <ellipse cx="38" cy="59" rx="10" ry="4.5" fill={p.leafL} transform="rotate(-30 38 59)" />
        {/* flor */}
        <g transform="translate(49 38)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="0" rx="5" ry="9" fill={p.petal} transform={`rotate(${a}) translate(0 -9)`} />
          ))}
          <circle cx="0" cy="0" r="5.5" fill={p.petalC} />
          <circle cx="0" cy="0" r="2.6" fill={p.petalHi} />
        </g>
      </g>
    </Svg>
  )
}

// 5 — Árbol
function Arbol({ night }) {
  const p = palette(night)
  return (
    <Svg>
      <Soil p={p} />
      <path d="M46,101 L44.5,72 Q50,68 55.5,72 L54,101 Z" fill={p.trunk} />
      <path d="M50.5,99 L50,70 Q52.5,69 54.5,72 L54,99 Z" fill={p.trunkHi} opacity="0.6" />
      <ellipse cx="50" cy="56" rx="31" ry="25" fill={p.canopyD} />
      <ellipse cx="36" cy="51" rx="17" ry="15" fill={p.canopyM} />
      <ellipse cx="64" cy="50" rx="17" ry="14" fill={p.canopyM} />
      <ellipse cx="50" cy="43" rx="21" ry="17" fill={p.canopyL} />
      <ellipse cx="43" cy="48" rx="9" ry="7" fill={p.canopyHi} opacity="0.7" />
    </Svg>
  )
}

// 6 — Árbol especial (en flor)
function ArbolEspecial({ night }) {
  const p = palette(night)
  const spark = night ? '#d8cdec' : '#fff4cf'
  return (
    <Svg>
      <Soil p={p} />
      <path d="M46,101 L44.5,72 Q50,68 55.5,72 L54,101 Z" fill={p.trunk} />
      <path d="M50.5,99 L50,70 Q52.5,69 54.5,72 L54,99 Z" fill={p.trunkHi} opacity="0.6" />
      <ellipse cx="50" cy="56" rx="31" ry="25" fill={p.blossomD} />
      <ellipse cx="36" cy="51" rx="17" ry="15" fill={p.blossomM} />
      <ellipse cx="64" cy="50" rx="17" ry="14" fill={p.blossomM} />
      <ellipse cx="50" cy="43" rx="21" ry="17" fill={p.blossomL} />
      {/* florecitas */}
      {[[34, 56], [46, 44], [60, 40], [66, 56], [52, 60], [40, 40], [58, 52]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill={p.blossomDot} opacity="0.9" />
      ))}
      {/* destellos / pétalos cayendo */}
      <circle cx="26" cy="62" r="2.4" fill={spark} style={{ animation: 'sparkleFloat 2.4s ease-in-out infinite' }} />
      <circle cx="74" cy="58" r="2" fill={spark} style={{ animation: 'sparkleFloat 3s ease-in-out infinite 0.8s' }} />
      <circle cx="54" cy="34" r="1.8" fill={spark} style={{ animation: 'sparkleFloat 2.7s ease-in-out infinite 1.4s' }} />
    </Svg>
  )
}

const STAGES = [Tierra, Semilla, Brote, Planta, Flor, Arbol, ArbolEspecial]

export default function PlantSVG({ stage = 0, night = false }) {
  const Plant = STAGES[Math.min(Math.max(stage, 0), STAGES.length - 1)]
  return <Plant night={night} />
}
