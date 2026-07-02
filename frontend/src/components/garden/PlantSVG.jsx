const SWAY = {
  transformBox: 'fill-box',
  transformOrigin: 'bottom center',
  animation: 'plantSway 3.5s ease-in-out infinite',
}
const SWAY_BIG = {
  transformBox: 'fill-box',
  transformOrigin: 'bottom center',
  animation: 'plantSwayBig 3s ease-in-out infinite',
}

const BLOOM = {
  transformBox: 'fill-box',
  transformOrigin: 'center center',
  animation: 'petalBloom 4s ease-in-out infinite',
}

// Paletas día / noche fieles a la referencia
function palette(night) {
  return night
    ? {
        soil: '#4a3622',
        soilTop: '#5a4530',
        soilDark: '#2f2214',
        clump: '#604a30',
        seed: '#a98545',
        seedHi: '#caa468',
        stem: '#3f5a2c',
        leafD: '#2f5226',
        leafM: '#3c6a30',
        leafL: '#4e8038',
        petal: '#b9a24a',
        petalC: '#9a6a2a',
        petalHi: '#d8c878',
        trunk: '#3f2c1a',
        trunkHi: '#4f3a24',
        canopyD: '#274a1f',
        canopyM: '#315d28',
        canopyL: '#3f7233',
        canopyHi: '#4d8540',
        blossomD: '#7a5a72',
        blossomM: '#9a7790',
        blossomL: '#b49aad',
        blossomDot: '#c8aec0',
      }
    : {
        soil: '#8a6a45',
        soilTop: '#9c7c54',
        soilDark: '#6e5436',
        clump: '#7d5e3c',
        seed: '#cba35c',
        seedHi: '#ecd49a',
        stem: '#5c7c3a',
        leafD: '#3f7a2e',
        leafM: '#54983c',
        leafL: '#72b350',
        petal: '#f4c93f',
        petalC: '#e8892a',
        petalHi: '#fbe58a',
        trunk: '#7d5836',
        trunkHi: '#956d47',
        canopyD: '#3f7a2e',
        canopyM: '#52983c',
        canopyL: '#6fb24c',
        canopyHi: '#8cc763',
        blossomD: '#e493b1',
        blossomM: '#f2b6cf',
        blossomL: '#fad7e4',
        blossomDot: '#ffffff',
      }
}

function Soil({ p }) {
  return (
    <g>
      {/* sombra proyectada */}
      <ellipse cx="50" cy="111" rx="40" ry="8" fill={p.soilDark} opacity="0.28" />

      {/* halo de tierra clara */}
      <ellipse cx="50" cy="108" rx="47" ry="14" fill={p.soilTop} opacity="0.18" />

      {/* montículo principal */}
      <path
        d="
          M16 111
          C18 102 26 94 34 92
          C38 82 46 80 50 80
          C55 79 61 82 65 91
          C74 92 82 100 84 111
          Z
        "
        fill={p.soil}
      />

      {/* sombras laterales */}
      <ellipse cx="34" cy="102" rx="12" ry="9" fill={p.soilDark} opacity="0.55" />

      <ellipse cx="66" cy="101" rx="13" ry="9" fill={p.soilDark} opacity="0.5" />

      {/* iluminación superior */}
      {/* <ellipse cx="50" cy="90" rx="24" ry="9" fill={p.soilTop} opacity="0.85" />

      <ellipse cx="50" cy="95" rx="15" ry="5" fill={p.soilTop} opacity="0.45" /> */}

      {/* terrones grandes */}
      <ellipse cx="42" cy="100" rx="6" ry="4" fill={p.clump} />

      <ellipse cx="58" cy="99" rx="7" ry="4" fill={p.clump} />

      {/* piedras */}
      <circle cx="27" cy="106" r="3.2" fill={p.clump} />
      <circle cx="37" cy="110" r="2.5" fill={p.clump} />
      <circle cx="62" cy="108" r="2.8" fill={p.clump} />
      <circle cx="72" cy="105" r="3.4" fill={p.clump} />

      {/* piedritas pequeñas */}
      <circle cx="31" cy="103" r="1.4" fill={p.soilDark} />
      <circle cx="67" cy="102" r="1.2" fill={p.soilDark} />
      <circle cx="55" cy="106" r="1.1" fill={p.soilDark} />

      {/* hierba izquierda */}
      <g opacity="0.9">
        <path d="M23 98 L20 88" stroke={p.leafM} strokeWidth="2" strokeLinecap="round" />
        <path d="M23 98 L16 91" stroke={p.leafL} strokeWidth="2" strokeLinecap="round" />
        <path d="M23 98 L27 89" stroke={p.leafD} strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* hierba derecha */}
      <g opacity="0.9">
        <path d="M77 100 L74 90" stroke={p.leafM} strokeWidth="2" strokeLinecap="round" />
        <path d="M77 100 L70 94" stroke={p.leafL} strokeWidth="2" strokeLinecap="round" />
        <path d="M77 100 L81 91" stroke={p.leafD} strokeWidth="2" strokeLinecap="round" />
      </g>
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

      {/* sombra de la semilla */}
      <ellipse cx="50" cy="89.5" rx="7.5" ry="2.2" fill={p.soilDark} opacity="0.35" />

      {/* semilla */}
      <g transform="rotate(-16 50 84)">
        {/* cuerpo */}
        <ellipse cx="50" cy="84" rx="5.6" ry="8.8" fill={p.seed} />

        {/* iluminación */}
        <ellipse cx="48.2" cy="81.2" rx="1.8" ry="3.4" fill={p.seedHi} opacity="0.9" />

        {/* línea característica */}
        <path
          d="M50 79 C48.7 81.5 48.7 85.2 50 89"
          stroke="#8f6b34"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* sombra lateral */}
        <ellipse cx="52" cy="86" rx="1.8" ry="5" fill="#8d6a37" opacity="0.18" />
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
        {/* tallo */}
        <path
          d="M50 88
             C50 82
               49.5 76
               49 69"
          fill="none"
          stroke={p.stem}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* hoja izquierda */}
        <path
          d="
            M49 73
            C43 68 38 69 37 74
            C39 78 45 78 49 73
            Z
          "
          fill={p.leafM}
        />

        {/* brillo hoja izquierda */}
        <path
          d="
            M46.5 72.5
            C44 71
              41.5 71.8
              40.5 74
          "
          fill="none"
          stroke={p.leafL}
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* hoja derecha */}
        <path
          d="
            M49 69
            C55 64 61 65 63 70
            C60 74 54 74 49 69
            Z
          "
          fill={p.leafD}
        />

        {/* brillo hoja derecha */}
        <path
          d="
            M51 69
            C54 67
              57 67.5
              59.5 69.5
          "
          fill="none"
          stroke={p.leafL}
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* yema superior */}
        <circle cx="49" cy="67" r="2.2" fill={p.leafL} />
      </g>
    </Svg>
  )
}

// // 2 — Brote
// function Brote({ night }) {
//   const p = palette(night)
//   return (
//     <Svg>
//       <Soil p={p} />
//       <g style={SWAY}>
//         <path
//           d="M50,88 C50,78 49,72 49,66"
//           stroke={p.stem}
//           strokeWidth="3"
//           fill="none"
//           strokeLinecap="round"
//         />
//         <ellipse cx="40" cy="69" rx="9" ry="4" fill={p.leafL} transform="rotate(-34 40 69)" />
//         <ellipse cx="59" cy="66" rx="9" ry="4" fill={p.leafM} transform="rotate(34 59 66)" />
//         <circle cx="49" cy="64" r="3" fill={p.leafL} />
//       </g>
//     </Svg>
//   )
// }

// 3 — Planta

// 3 — Planta

function Planta({ night }) {
  const p = palette(night)

  return (
    <Svg>
      <Soil p={p} />

      <g style={SWAY}>
        {/* tallo principal */}
        <path
          d="
            M50 88
            C50 82
              49 73
              50 63
            C51 54
              50 46
              50 38
          "
          fill="none"
          stroke={p.stem}
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* ========================= */}
        {/* Hojas inferiores */}
        {/* ========================= */}

        <path
          d="
            M50 75
            C42 70 36 71 34 77
            C38 81 45 80 50 75
            Z
          "
          fill={p.leafM}
        />

        <path
          d="
            M50 72
            C58 67 65 68 67 74
            C63 78 56 77 50 72
            Z
          "
          fill={p.leafD}
        />

        {/* ========================= */}
        {/* Hojas medias */}
        {/* ========================= */}

        <path
          d="
            M50 61
            C43 56 39 56 38 61
            C41 65 46 65 50 61
            Z
          "
          fill={p.leafL}
        />

        <path
          d="
            M50 58
            C57 53 62 53 64 58
            C61 62 55 62 50 58
            Z
          "
          fill={p.leafM}
        />

        {/* ========================= */}
        {/* Hojas superiores */}
        {/* ========================= */}

        <path
          d="
            M50 48
            C45 44 42 44 42 48
            C44 51 48 51 50 48
            Z
          "
          fill={p.leafM}
        />

        <path
          d="
            M50 45
            C55 41 59 41 60 45
            C58 49 54 49 50 45
            Z
          "
          fill={p.leafD}
        />

        {/* nervaduras */}
        <path
          d="M47 74 L41 76"
          stroke={p.leafL}
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.7"
        />

        <path
          d="M53 72 L60 74"
          stroke={p.leafL}
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.7"
        />

        <path
          d="M47.5 60 L43 61"
          stroke={p.leafD}
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.6"
        />

        <path
          d="M52.5 58 L57 59"
          stroke={p.leafL}
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* yema superior */}
        <ellipse cx="50" cy="35" rx="3.5" ry="5" fill={p.leafL} />

        {/* brillo de la yema */}
        <ellipse cx="49" cy="33.5" rx="1.2" ry="2" fill="#ffffff" opacity="0.25" />
      </g>
    </Svg>
  )
}

// function Planta({ night }) {
//   const p = palette(night)
//   return (
//     <Svg>
//       <Soil p={p} />
//       <g style={SWAY}>
//         <path
//           d="M50,89 C50,72 49,54 49,40"
//           stroke={p.stem}
//           strokeWidth="3.5"
//           fill="none"
//           strokeLinecap="round"
//         />
//         <ellipse cx="35" cy="78" rx="13" ry="5.5" fill={p.leafM} transform="rotate(-38 35 78)" />
//         <ellipse cx="64" cy="72" rx="13" ry="5.5" fill={p.leafD} transform="rotate(38 64 72)" />
//         <ellipse cx="36" cy="61" rx="12" ry="5" fill={p.leafL} transform="rotate(-30 36 61)" />
//         <ellipse cx="63" cy="55" rx="12" ry="5" fill={p.leafM} transform="rotate(30 63 55)" />
//         {/* cogollo superior */}
//         <ellipse cx="44" cy="42" rx="8" ry="4" fill={p.leafL} transform="rotate(-48 44 42)" />
//         <ellipse cx="56" cy="42" rx="8" ry="4" fill={p.leafM} transform="rotate(48 56 42)" />
//         <ellipse cx="49" cy="36" rx="5.5" ry="8" fill={p.leafL} />
//       </g>
//     </Svg>
//   )
// }

// 4 — Flor

// 4 — Flor
function Flor({ night }) {
  const p = palette(night)

  return (
    <Svg>
      <Soil p={p} />

      <g style={SWAY_BIG}>
        {/* tallo */}
        <path
          d="
            M50 88
            C50 82
              49 73
              50 63
            C51 54
              50 46
              50 34
          "
          fill="none"
          stroke={p.stem}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* hojas inferiores */}

        <path
          d="
            M50 75
            C42 70 36 71 34 77
            C38 81 45 80 50 75
            Z
          "
          fill={p.leafM}
        />

        <path
          d="
            M50 72
            C58 67 65 68 67 74
            C63 78 56 77 50 72
            Z
          "
          fill={p.leafD}
        />

        {/* hojas medias */}

        <path
          d="
            M50 61
            C43 56 39 56 38 61
            C41 65 46 65 50 61
            Z
          "
          fill={p.leafL}
        />

        <path
          d="
            M50 58
            C57 53 62 53 64 58
            C61 62 55 62 50 58
            Z
          "
          fill={p.leafM}
        />

        {/* hojas superiores */}

        <path
          d="
            M50 46
            C45 42 42 42 42 46
            C44 49 48 49 50 46
            Z
          "
          fill={p.leafM}
        />

        <path
          d="
            M50 43
            C55 39 59 39 60 43
            C58 47 54 47 50 43
            Z
          "
          fill={p.leafD}
        />

        {/* hojitas del pedúnculo */}

        <path
          d="
            M50 30
            C46 28 44 29 44 32
            C46 34 49 33 50 30
            Z
          "
          fill={p.leafL}
        />

        <path
          d="
            M50 28
            C54 26 57 27 57 30
            C55 33 52 32 50 28
            Z
          "
          fill={p.leafM}
        />

        {/* ========================= */}
        {/* FLOR */}
        {/* ========================= */}

        <g style={BLOOM}>
          {/* pétalo superior */}
          <ellipse cx="50" cy="22" rx="3.8" ry="7" fill={p.petal} />

          {/* inferior */}
          <ellipse cx="50" cy="22" rx="3.8" ry="7" fill={p.petal} transform="rotate(180 50 22)" />

          {/* izquierda */}
          <ellipse cx="50" cy="22" rx="3.8" ry="7" fill={p.petal} transform="rotate(60 50 22)" />

          {/* derecha */}
          <ellipse cx="50" cy="22" rx="3.8" ry="7" fill={p.petal} transform="rotate(-60 50 22)" />

          {/* diagonal */}
          <ellipse cx="50" cy="22" rx="3.8" ry="7" fill={p.petalHi} transform="rotate(120 50 22)" />

          <ellipse
            cx="50"
            cy="22"
            rx="3.8"
            ry="7"
            fill={p.petalHi}
            transform="rotate(-120 50 22)"
          />

          {/* centro */}

          <circle cx="50" cy="22" r="4.5" fill={p.petalC} />

          <circle cx="50" cy="22" r="2.1" fill={p.petalHi} />

          {/* brillo */}

          <circle cx="48.8" cy="20.8" r="0.8" fill="#fff" opacity="0.45" />
        </g>
      </g>
    </Svg>
  )
}

// function Flor({ night }) {
//   const p = palette(night)
//   return (
//     <Svg>
//       <Soil p={p} />
//       <g style={SWAY_BIG}>
//         <path
//           d="M50,89 C50,74 49,58 49,46"
//           stroke={p.stem}
//           strokeWidth="3.2"
//           fill="none"
//           strokeLinecap="round"
//         />
//         <ellipse cx="36" cy="76" rx="13" ry="5.5" fill={p.leafM} transform="rotate(-38 36 76)" />
//         <ellipse cx="63" cy="69" rx="13" ry="5.5" fill={p.leafD} transform="rotate(38 63 69)" />
//         <ellipse cx="38" cy="59" rx="10" ry="4.5" fill={p.leafL} transform="rotate(-30 38 59)" />
//         {/* flor */}
//         <g transform="translate(49 38)">
//           {[0, 72, 144, 216, 288].map((a) => (
//             <ellipse
//               key={a}
//               cx="0"
//               cy="0"
//               rx="5"
//               ry="9"
//               fill={p.petal}
//               transform={`rotate(${a}) translate(0 -9)`}
//             />
//           ))}
//           <circle cx="0" cy="0" r="5.5" fill={p.petalC} />
//           <circle cx="0" cy="0" r="2.6" fill={p.petalHi} />
//         </g>
//       </g>
//     </Svg>
//   )
// }

// 5 — Árbol
function Arbol({ night }) {
  const p = palette(night)

  return (
    <Svg viewBox="0 0 100 140">
      <Soil p={p} />

      <g
        style={{
          transformBox: 'fill-box',
          transformOrigin: '50% 100%',
          animation: 'treeSway 8s ease-in-out infinite',
        }}
      >
        {/*=========================
            TRONCO
        =========================*/}

        <path
          d="
            M44 88
            C44 76 45 62 46 50
            C47 38 48 26 49 18
            C49 15 51 15 51 18
            C52 26 53 38 54 50
            C55 62 56 76 56 88
            Z
          "
          fill={p.trunk}
        />

        {/* Luz */}

        <path
          d="
            M49.5 18
            C50 35
              50 60
              50 88
          "
          fill="none"
          stroke={p.trunkHi}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity=".7"
        />

        {/*=========================
            RAMAS
        =========================*/}

        <path
          d="
            M49 54
            C41 49
              34 42
              29 34
          "
          fill="none"
          stroke={p.trunk}
          strokeWidth="2.3"
          strokeLinecap="round"
        />

        <path
          d="
            M51 48
            C59 43
              66 35
              72 26
          "
          fill="none"
          stroke={p.trunk}
          strokeWidth="2.3"
          strokeLinecap="round"
        />

        <path
          d="
            M50 38
            C45 31
              41 24
              39 17
          "
          fill="none"
          stroke={p.trunk}
          strokeWidth="1.9"
          strokeLinecap="round"
        />

        {/*=========================
            COPA
        =========================*/}

        {/* Base */}

        <ellipse cx="50" cy="42" rx="33" ry="23" fill={p.canopyD} />

        {/* Inferiores */}

        <circle cx="28" cy="45" r="14" fill={p.canopyM} />
        <circle cx="72" cy="43" r="15" fill={p.canopyM} />

        {/* Medias */}

        <circle cx="36" cy="28" r="15" fill={p.canopyL} />
        <circle cx="64" cy="27" r="15" fill={p.canopyL} />

        {/* Centro */}

        <circle cx="50" cy="23" r="18" fill={p.canopyHi} />

        {/* Superiores */}

        <circle cx="40" cy="12" r="10" fill={p.canopyHi} />
        <circle cx="60" cy="12" r="10" fill={p.canopyHi} />

        <circle cx="26" cy="24" r="10" fill={p.canopyL} />
        <circle cx="74" cy="23" r="10" fill={p.canopyL} />

        {/*=========================
            DETALLES DE HOJAS
        =========================*/}

        {[
          [31, 34],
          [37, 18],
          [45, 10],
          [56, 11],
          [67, 18],
          [71, 34],
          [63, 50],
          [50, 55],
          [37, 51],
          [25, 26],
          [58, 36],
          [44, 37],
          [34, 41],
          [60, 21],
          [48, 28],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.4" fill={p.canopyHi} opacity=".9" />
        ))}

        {/*=========================
            FLORECITAS
        =========================*/}

        {[
          [36, 22],
          [47, 14],
          [60, 18],
          [66, 32],
          [56, 45],
          [42, 44],
          [30, 34],
          [52, 30],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="1.9" fill={p.blossomL} />

            <circle cx={x} cy={y} r=".55" fill={p.blossomDot} />
          </g>
        ))}
      </g>
    </Svg>
  )
}

// 5 — Árbol
// function Arbol({ night }) {
//   const p = palette(night)
//   return (
//     <Svg>
//       <Soil p={p} />
//       <path d="M46,101 L44.5,72 Q50,68 55.5,72 L54,101 Z" fill={p.trunk} />
//       <path d="M50.5,99 L50,70 Q52.5,69 54.5,72 L54,99 Z" fill={p.trunkHi} opacity="0.6" />
//       <ellipse cx="50" cy="56" rx="31" ry="25" fill={p.canopyD} />
//       <ellipse cx="36" cy="51" rx="17" ry="15" fill={p.canopyM} />
//       <ellipse cx="64" cy="50" rx="17" ry="14" fill={p.canopyM} />
//       <ellipse cx="50" cy="43" rx="21" ry="17" fill={p.canopyL} />
//       <ellipse cx="43" cy="48" rx="9" ry="7" fill={p.canopyHi} opacity="0.7" />
//     </Svg>
//   )
// }

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
      {[
        [34, 56],
        [46, 44],
        [60, 40],
        [66, 56],
        [52, 60],
        [40, 40],
        [58, 52],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill={p.blossomDot} opacity="0.9" />
      ))}
      {/* destellos / pétalos cayendo */}
      <circle
        cx="26"
        cy="62"
        r="2.4"
        fill={spark}
        style={{ animation: 'sparkleFloat 2.4s ease-in-out infinite' }}
      />
      <circle
        cx="74"
        cy="58"
        r="2"
        fill={spark}
        style={{ animation: 'sparkleFloat 3s ease-in-out infinite 0.8s' }}
      />
      <circle
        cx="54"
        cy="34"
        r="1.8"
        fill={spark}
        style={{ animation: 'sparkleFloat 2.7s ease-in-out infinite 1.4s' }}
      />
    </Svg>
  )
}

const STAGES = [Tierra, Semilla, Brote, Planta, Flor, Arbol, ArbolEspecial]

export default function PlantSVG({ stage = 0, night = false }) {
  const Plant = STAGES[Math.min(Math.max(stage, 0), STAGES.length - 1)]
  return <Plant night={night} />
}
