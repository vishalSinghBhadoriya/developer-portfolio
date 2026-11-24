import { publicAsset } from './assets'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from './components'
import { makeParticles } from './particleGeometry'
import { useMedia } from './motion'

const ParticleScene = lazy(() => import('./ParticleScene'))
const prints = ['particles-ribbon.webp', 'particles-data.webp', 'particles-geometry.webp'].map(publicAsset)

function PointPrint({ form, className, count, live, signals }) {
  const canvas = useRef(null)
  useEffect(() => {
    const context = canvas.current.getContext('2d')
    if (!context) return
    const size = canvas.current.width
    const { ribbon, wave, prism, seed } = makeParticles(count)
    const array = [ribbon, wave, prism][form]
    const order = Array.from({ length: count }, (_, index) => index)
      .sort((a, b) => array[a * 3 + 2] - array[b * 3 + 2])
    let frame
    let elapsed = 0
    let previous = performance.now()

    function draw(time) {
      const input = signals?.current
      elapsed += Math.min(50, time - previous) * .001 * (input?.speed ?? 1)
      previous = time
      const angle = -.24 + (live ? Math.sin(elapsed * .5) * .27 : 0)
      const cosine = Math.cos(angle)
      const sine = Math.sin(angle)
      context.clearRect(0, 0, size, size)
      for (const index of order) {
        const offset = index * 3
        const x = array[offset]
        const y = array[offset + 1] + (live ? Math.sin(elapsed * 2 + x * 3) * .11 : 0)
        const z = array[offset + 2]
        const depth = (z + 1.6) / 3.2
        const scale = size * .253 * (1 + z * .13)
        let px = (x * cosine - y * sine) * scale
        let py = -(x * sine + y * cosine) * scale
        if (live && input?.inside) {
          const dx = px - input.x * size / 2
          const dy = py + input.y * size / 2
          const force = Math.exp(-(dx * dx + dy * dy) / (size * size * .027)) * (input.strength ?? 1)
          px += dx * force * .52
          py += dy * force * .52
        }
        const light = Math.sin(y * 18 + x * 5) ** 4
        const radius = .64 + seed[index] ** 4 * 1.65
        context.globalAlpha = .29 + depth * .35 + light * .31
        context.fillStyle = seed[index] > .76 ? '#efe8ff' : depth > .5 ? '#c4b5fd' : '#8751f3'
        context.beginPath()
        context.arc(size / 2 + px, size / 2 + py, radius, 0, Math.PI * 2)
        context.fill()
      }
      if (live) frame = requestAnimationFrame(draw)
    }
    draw(previous)
    return () => cancelAnimationFrame(frame)
  }, [form, count, live, signals])
  return <canvas ref={canvas} width={560} height={560} className={className} />
}

export default function ParticleField({ signals, form = 0, interactive = false, count, demo = false, variant = 'hero' }) {
  const field = useRef(null)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const desktop = useMedia('(min-width: 950px) and (pointer: fine)')
  const [available, setAvailable] = useState(false)
  const [onscreen, setOnscreen] = useState(false)
  const [ready, setReady] = useState(false)
  const report = useCallback(value => setReady(value), [])
  const canRender = interactive && !reduced && (desktop || demo)

  useEffect(() => {
    if (!canRender || !onscreen || (navigator.deviceMemory ?? 8) < 4) return
    try {
      const check = document.createElement('canvas').getContext('webgl2')
      if (!check) return
      check.getExtension('WEBGL_lose_context')?.loseContext()
      setAvailable(true)
    } catch {
      setAvailable(false)
    }
  }, [canRender, onscreen])

  useEffect(() => {
    if (!interactive) return
    const observer = new IntersectionObserver(([entry]) => {
      setOnscreen(entry.isIntersecting)
      if (!entry.isIntersecting) setReady(false)
    })
    observer.observe(field.current)
    return () => observer.disconnect()
  }, [interactive])

  const showScene = canRender && available && onscreen
  const printClass = 'particle-print' + (showScene && ready ? ' is-hidden' : '')
  return <div ref={field} className={'particle-field particle-' + variant} aria-hidden="true"
    data-renderer={showScene && ready ? 'webgl' : 'canvas'}>
    <div className="particle-halo" />
    {demo ? <PointPrint className={printClass} form={form} count={Math.round((count ?? 8000) * .20)}
      live={onscreen && !reduced && !(showScene && ready)} signals={signals} />
      : <img className={printClass} src={prints[form]} alt="" width="560" height="560"
        loading={variant === 'contact' ? 'lazy' : 'eager'} fetchPriority={variant === 'hero' ? 'high' : 'auto'} decoding="async" />}
    {showScene && <div className="particle-scene">
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <ParticleScene signals={signals} onReady={report} count={count} variant={variant} />
        </Suspense>
      </ErrorBoundary>
    </div>}
  </div>
}
