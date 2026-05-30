export default function PlantIllustration() {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-48"
      aria-hidden="true"
    >
      {/* Resplandor de fondo */}
      <circle cx="110" cy="110" r="90" fill="#D9C7A2" fillOpacity="0.2" />
      <circle cx="110" cy="115" r="60" fill="#A8B79A" fillOpacity="0.12" />

      {/* Maceta */}
      <path
        d="M75 165 L85 190 L135 190 L145 165 Z"
        fill="#C7B299"
      />
      <ellipse cx="110" cy="165" rx="35" ry="8" fill="#B8A08A" />
      {/* Borde superior maceta */}
      <ellipse cx="110" cy="165" rx="35" ry="8" fill="#D4B896" fillOpacity="0.8" />
      {/* Tierra */}
      <ellipse cx="110" cy="165" rx="28" ry="6" fill="#8B6F5E" fillOpacity="0.5" />

      {/* Tallo principal */}
      <path
        d="M110 163 C109 148 108 132 110 110"
        stroke="#7A8F63"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Hoja izquierda grande */}
      <path
        d="M110 140 C95 132 78 122 72 104 C80 108 96 128 110 140Z"
        fill="#A8B79A"
      />
      <path
        d="M110 140 C96 132 82 124 74 108"
        stroke="#7A8F63"
        strokeWidth="1"
        strokeLinecap="round"
        fillOpacity="0"
      />

      {/* Hoja derecha grande */}
      <path
        d="M110 128 C124 118 140 108 148 90 C138 96 122 116 110 128Z"
        fill="#7A8F63"
      />
      <path
        d="M110 128 C124 118 138 108 146 92"
        stroke="#5C7050"
        strokeWidth="1"
        strokeLinecap="round"
        fillOpacity="0"
      />

      {/* Hoja izquierda pequeña */}
      <path
        d="M110 115 C100 108 88 102 84 90 C90 94 103 106 110 115Z"
        fill="#A8B79A"
        fillOpacity="0.85"
      />

      {/* Brote superior */}
      <path
        d="M110 110 C107 98 105 86 110 76 C115 86 113 98 110 110Z"
        fill="#7A8F63"
      />

      {/* Hojita superior */}
      <path
        d="M110 88 C104 82 100 74 104 66 C108 72 108 82 110 88Z"
        fill="#A8B79A"
      />
      <path
        d="M110 88 C116 82 120 74 116 66 C112 72 112 82 110 88Z"
        fill="#A8B79A"
        fillOpacity="0.7"
      />

      {/* Destellos suaves */}
      <circle cx="88" cy="100" r="2.5" fill="#D9C7A2" fillOpacity="0.6" />
      <circle cx="135" cy="95" r="2" fill="#D9C7A2" fillOpacity="0.5" />
      <circle cx="78" cy="128" r="1.5" fill="#D9C7A2" fillOpacity="0.4" />
    </svg>
  )
}
