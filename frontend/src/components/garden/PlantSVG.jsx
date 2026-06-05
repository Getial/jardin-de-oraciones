const SWAY = { transformBox: 'fill-box', transformOrigin: 'bottom center', animation: 'plantSway 3.5s ease-in-out infinite' }
const SWAY_BIG = { transformBox: 'fill-box', transformOrigin: 'bottom center', animation: 'plantSwayBig 3s ease-in-out infinite' }
const BLOOM = { transformBox: 'fill-box', transformOrigin: 'center', animation: 'petalBloom 4s ease-in-out infinite' }

function Soil({ night }) {
  return (
    <>
      <ellipse cx="50" cy="112" rx="42" ry="11" fill={night ? '#3d2e1e' : '#c7b299'} />
      <ellipse cx="50" cy="106" rx="29" ry="8"  fill={night ? '#2e2010' : '#b09070'} />
    </>
  )
}

function Tierra({ night }) {
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'seedGrow 0.6s ease-out' }}>
      <Soil night={night} />
      <ellipse cx="50" cy="99" rx="11" ry="6" fill={night ? '#261a0a' : '#9a7855'} />
      <ellipse cx="50" cy="95" rx="5"  ry="3" fill={night ? '#4a3520' : '#7a5535'} opacity="0.8" />
    </svg>
  )
}

function Semilla({ night }) {
  const g1 = night ? '#4a7040' : '#7a8f63'
  const g2 = night ? '#3d6030' : '#a8b79a'
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Soil night={night} />
      <g style={SWAY}>
        <line x1="50" y1="104" x2="50" y2="76" stroke={g1} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="41" cy="83" rx="11" ry="4.5" fill={g2} transform="rotate(-40 41 83)" />
        <ellipse cx="59" cy="79" rx="11" ry="4.5" fill={g1} transform="rotate(40 59 79)" />
        <circle  cx="50"  cy="74" r="5"           fill={night ? '#4a8040' : '#8abf64'} />
      </g>
    </svg>
  )
}

function Brote({ night }) {
  const stem = night ? '#3d5028' : '#5a7040'
  const g1   = night ? '#4a6835' : '#7a8f63'
  const g2   = night ? '#3a5828' : '#a8b79a'
  const bud  = night ? '#4a7838' : '#8abf64'
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Soil night={night} />
      <g style={SWAY}>
        <line x1="50" y1="103" x2="50" y2="58" stroke={stem} strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="37" cy="81" rx="14" ry="5.5" fill={g2} transform="rotate(-38 37 81)" />
        <ellipse cx="63" cy="74" rx="14" ry="5.5" fill={g1} transform="rotate(38 63 74)" />
        <ellipse cx="38" cy="64" rx="11" ry="4.5" fill={g1} transform="rotate(-28 38 64)" />
        <circle  cx="50" cy="56" r="7"            fill={bud} />
        <circle  cx="50" cy="56" r="4"            fill={night ? '#6aaf54' : '#b0df80'} />
      </g>
    </svg>
  )
}

function Planta({ night }) {
  const stem = night ? '#3d5028' : '#4a6830'
  const g1   = night ? '#4a6835' : '#6a8f55'
  const g2   = night ? '#3a5828' : '#a8b79a'
  const g3   = night ? '#507840' : '#5a9050'
  const top  = night ? '#3a6030' : '#7ab060'
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Soil night={night} />
      <g style={SWAY}>
        <line x1="50" y1="103" x2="50" y2="35" stroke={stem} strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="36" cy="84" rx="15" ry="6"   fill={g2} transform="rotate(-40 36 84)" />
        <ellipse cx="64" cy="77" rx="15" ry="6"   fill={g1} transform="rotate(40 64 77)" />
        <ellipse cx="37" cy="62" rx="13" ry="5.5" fill={g3} transform="rotate(-30 37 62)" />
        <ellipse cx="63" cy="56" rx="13" ry="5.5" fill={g2} transform="rotate(30 63 56)" />
        <ellipse cx="50" cy="40" rx="15" ry="10"  fill={top} />
        <ellipse cx="50" cy="34" rx="11" ry="8"   fill={g1} />
      </g>
    </svg>
  )
}

function Flor({ night }) {
  const stem   = night ? '#3d5028' : '#4a6830'
  const g1     = night ? '#4a6835' : '#7a8f63'
  const g2     = night ? '#3a5828' : '#a8b79a'
  const petal  = night ? '#a890d8' : '#f5d060'
  const center = night ? '#c8a030' : '#e08010'
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Soil night={night} />
      <g style={SWAY_BIG}>
        <line x1="50" y1="103" x2="50" y2="44" stroke={stem} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="36" cy="82" rx="14" ry="5.5" fill={g2} transform="rotate(-40 36 82)" />
        <ellipse cx="64" cy="76" rx="14" ry="5.5" fill={g1} transform="rotate(40 64 76)" />
        <ellipse cx="37" cy="62" rx="12" ry="5"   fill={g1} transform="rotate(-30 37 62)" />
        <g style={BLOOM}>
          <ellipse cx="50" cy="33" rx="7" ry="12" fill={petal} opacity="0.9" />
          <ellipse cx="50" cy="33" rx="7" ry="12" fill={petal} opacity="0.9" transform="rotate(60 50 33)" />
          <ellipse cx="50" cy="33" rx="7" ry="12" fill={petal} opacity="0.9" transform="rotate(120 50 33)" />
          <circle  cx="50" cy="33" r="9"           fill={center} />
          <circle  cx="50" cy="33" r="5"           fill={night ? '#f0d060' : '#fef090'} />
        </g>
      </g>
    </svg>
  )
}

function Arbol({ night }) {
  const trunk  = night ? '#3d2010' : '#7a5530'
  const c1     = night ? '#253818' : '#3a7020'
  const c2     = night ? '#2e4820' : '#4a8830'
  const c3     = night ? '#3a5828' : '#6aaa48'
  const spark  = night ? '#c8c0f0' : '#f0d060'
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Soil night={night} />
      <rect x="43" y="80" width="14" height="28" rx="5" fill={trunk} />
      <ellipse cx="50" cy="76" rx="32" ry="23" fill={c1} />
      <ellipse cx="50" cy="67" rx="27" ry="20" fill={c2} />
      <ellipse cx="50" cy="58" rx="21" ry="17" fill={c3} />
      <ellipse cx="50" cy="50" rx="15" ry="13" fill={c2} />
      <circle cx="27" cy="64" r="3"   fill={spark} style={{ animation: 'sparkleFloat 2s ease-in-out infinite' }} />
      <circle cx="73" cy="59" r="2.5" fill={spark} style={{ animation: 'sparkleFloat 2.5s ease-in-out infinite 0.6s' }} />
      <circle cx="55" cy="40" r="2"   fill={spark} style={{ animation: 'sparkleFloat 3s ease-in-out infinite 1.2s' }} />
    </svg>
  )
}

const STAGES = [Tierra, Semilla, Brote, Planta, Flor, Arbol]

export default function PlantSVG({ stage = 0, night = false }) {
  const Plant = STAGES[Math.min(Math.max(stage, 0), 5)]
  return <Plant night={night} />
}
