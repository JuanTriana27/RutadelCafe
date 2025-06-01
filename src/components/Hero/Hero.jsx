import React, { useRef, useEffect, useState } from 'react'
import styles from './HeroSection.module.css'

const TOTAL_FRAMES = 10

// Arreglo con todas las “etapas” (10) más el bloque inicial y el bloque de cierre
// Índices:
//   0 → inicial (Ruta del Café)
//   1 → Siembra
//   2 → Cosecha
//   3 → Lavado
//   4 → Trillado
//   5 → Secado
//   6 → Empaque
//   7 → Transporte
//   8 → Tostado
//   9 → Molienda
//  10 → Preparación
//  >10 → Consumo
const STAGES = [
  {
    type: 'initial',
    title: 'LA RUTA DEL CAFÉ',
    subtitles: [
      'AVANZA CON EL SCROLL Y',
      'EXPLORA LA RUTA DEL CAFÉ'
    ]
  },
  {
    type: 'stage',
    title: 'Siembra',
    desc: 'Plantación de semillas en viveros controlados. Se seleccionan las variedades adecuadas para la región y se da un ambiente óptimo para el crecimiento inicial de la planta.'
  },
  {
    type: 'stage',
    title: 'Cosecha',
    desc: 'Recolección manual selectiva de granos maduros. Un recolector experto separa únicamente las cerezas en su punto de madurez ideal para garantizar calidad.'
  },
  {
    type: 'stage',
    title: 'Lavado',
    desc: 'Proceso de despulpado y lavado de los granos para eliminar la pulpa exterior. Se utiliza agua limpia para remover mucílago y preparar el grano para el siguiente paso.'
  },
  {
    type: 'stage',
    title: 'Trillado',
    desc: 'Quitar la cáscara seca del fruto de café. Tradicionalmente se hace en pilas o molinos de piedra; hoy en día hay máquinas que separan el pergamino con precisión.'
  },
  {
    type: 'stage',
    title: 'Secado',
    desc: 'Secado natural al sol o en secaderos mecánicos. Durante 8-10 días se controla la humedad, volteando periódicamente para un secado uniforme y evitar fermentaciones indeseadas.'
  },
  {
    type: 'stage',
    title: 'Empaque',
    desc: 'Los granos secos se clasifican por tamaño y calidad, luego se empacan en sacos de yute o en tanques herméticos. Esto protege el café de la humedad y mantiene sus propiedades hasta el tostado.'
  },
  {
    type: 'stage',
    title: 'Transporte',
    desc: 'Movilización del café desde la zona de producción hasta la planta de tueste o al puerto de exportación. Se cuidan las condiciones de temperatura y humedad para conservar la calidad.'
  },
  {
    type: 'stage',
    title: 'Tostado',
    desc: 'Proceso en el que los granos verdes se exponen a altas temperaturas. Se generan reacciones de Maillard y caramelización que desarrollan los aromas y sabores característicos del café.'
  },
  {
    type: 'stage',
    title: 'Molienda',
    desc: 'Los granos tostados se muelen al grosor adecuado según el método de preparación (espresso, filtro, prensa francesa, etc.). Una molienda correcta es clave para extraer los sabores deseados.'
  },
  {
    type: 'stage',
    title: 'Preparación',
    desc: 'El café molido se combina con agua caliente. Dependiendo del método (espresso, pour-over, prensa francesa), el tiempo y la proporción varían para obtener la taza perfecta.'
  },
  {
    type: 'end',
    title: 'Consumo',
    desc: '¡Gracias por ver todo! Ahora disfruta tu café, apreciando cada etapa del proceso que lo convierte en la bebida que tanto nos gusta.'
  }
]

const HeroSection = () => {
  const wrapperRef = useRef(null)
  const fixedRef = useRef(null)
  //  Cambiamos -1 → 0, para que desde el inicio muestre el bloque “Ruta del Café”
  const [currentFrame, setCurrentFrame] = useState(0)
  // currentFrame = 0 → bloque inicial
  // 1..9 → uno de los 9 siguientes frames
  // 10 → aún no ha salido del héroe pero forzaremos “Consumo” cuando pase
  //  (ver lógica en onScroll)

  useEffect(() => {
    // Precargar los 10 frames: frame1.jpg ... frame10.jpg
    const frames = Array.from({ length: TOTAL_FRAMES }, (_, i) => `/images/frame${i + 1}.jpg`)
    frames.forEach(src => {
      const img = new Image()
      img.src = src
    })

    // Asignamos ya la primera imagen (frame1) en cuanto monte el componente
    if (fixedRef.current) {
      fixedRef.current.style.backgroundImage = `url(${frames[0]})`
    }

    const onScroll = () => {
      if (!wrapperRef.current || !fixedRef.current) return

      const top0 = wrapperRef.current.offsetTop
      const totalScrollHeight = wrapperRef.current.offsetHeight - window.innerHeight
      const y = window.scrollY - top0

      // Si aún no hemos entrado al héroe, mantenemos currentFrame = 0
      if (y < 0) {
        setCurrentFrame(0)
        fixedRef.current.style.backgroundImage = `url(${frames[0]})`
        return
      }
      // Si pasamos todo el héroe, forzamos “Consumo”
      if (y > totalScrollHeight) {
        setCurrentFrame(TOTAL_FRAMES) // bloque “Consumo”
        return
      }

      // Estamos dentro de los 10 frames (y entre 0..totalScrollHeight)
      const frac = y / totalScrollHeight
      const idx = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(frac * TOTAL_FRAMES)
      )
      // Cambiamos la imagen de fondo: frame1..frame10
      fixedRef.current.style.backgroundImage = `url(${frames[idx]})`
      setCurrentFrame(idx)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Determina qué bloque de STAGES mostrar:
  //   currentFrame = 0   → STAGES[0] (“Ruta del Café”)
  //   1..9              → STAGES[1]..STAGES[9] (Siembra..Preparación)
  //   10                → STAGES[10] (“Consumo”)
  const getStageIndex = () => {
    if (currentFrame <= TOTAL_FRAMES - 1) {
      // 0..9 → mapeo a 0..9 en STAGES
      return currentFrame
    }
    // currentFrame === 10 → STAGES.length - 1 (último índice = 10)
    return STAGES.length - 1
  }

  const stageIdx = getStageIndex()

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={fixedRef} className={styles.fixedHero}>
        <div className={styles.overlay}></div>

        <div
          className={`${styles.frameText} ${currentFrame < 0 ? styles.hidden : styles.visible
            }`}
        >
          {/* Siempre mostramos al menos el bloque inicial si currentFrame ≥ 0 */}
          {stageIdx === 0 && (
            <div className={styles.initialText}>
              <h1 className={styles.mainTitle}>{STAGES[0].title}</h1>
              {STAGES[0].subtitles.map((s, i) => (
                <p key={i} className={styles.subtitle}>{s}</p>
              ))}
            </div>
          )}

          {stageIdx > 0 && stageIdx < STAGES.length && (
            <div className={styles.stageText}>
              <h1 className={styles.stageTitle}>{STAGES[stageIdx].title}</h1>
              <p className={styles.stageDesc}>{STAGES[stageIdx].desc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Después de los 10 frames, continúa el contenido normal */}
      <section className={styles.process}>
        <h2>SIEMBRA</h2>
        <p>Plantación de semillas en viveros controlados</p>
        <span>3-4 años para primera cosecha</span>
      </section>
      <section className={styles.process}>
        <h2>COSECHA</h2>
        <p>Recolección manual selectiva de granos maduros</p>
        <span>Un recolector experto cosecha hasta 100 kg diarios</span>
      </section>
      <section className={styles.process}>
        <h2>PROCESADO</h2>
        <p>Fermentación y secado natural de los granos</p>
        <span>8-10 días de secado al sol</span>
      </section>
    </div>
  )
}

export default HeroSection
