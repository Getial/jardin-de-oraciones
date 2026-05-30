import { useState, useEffect } from 'react'

const phrases = [
  { text: 'El Señor es mi pastor; nada me faltará.', ref: 'Salmos 23:1' },
  { text: 'Todo lo puedo en Cristo que me fortalece.', ref: 'Filipenses 4:13' },
  { text: 'Porque yo sé los planes que tengo para ustedes, planes de bienestar y no de calamidad.', ref: 'Jeremías 29:11' },
  { text: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.', ref: 'Mateo 11:28' },
  { text: 'Confía en el Señor con todo tu corazón y no te apoyes en tu propia prudencia.', ref: 'Proverbios 3:5' },
  { text: 'La fe es la certeza de lo que se espera, la convicción de lo que no se ve.', ref: 'Hebreos 11:1' },
  { text: 'Buscad primero el reino de Dios y su justicia, y todas estas cosas os serán añadidas.', ref: 'Mateo 6:33' },
  { text: 'El amor es sufrido, es benigno; el amor no tiene envidia, no es jactancioso.', ref: '1 Corintios 13:4' },
]

export default function BiblicalPhrase() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * phrases.length))
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length)
        setVisible(true)
      }, 500)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const phrase = phrases[index]

  return (
    <div
      className="text-center px-2"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      <p
        className="text-sm italic leading-relaxed"
        style={{ color: 'var(--color-text-muted)' }}
      >
        "{phrase.text}"
      </p>
      <p className="text-xs mt-1 font-medium" style={{ color: 'var(--color-primary)' }}>
        — {phrase.ref}
      </p>
    </div>
  )
}
