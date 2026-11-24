import { useRef, useState } from 'react'
import { RangeControl } from './components'
import ParticleField from './ParticleField'
import { usePointerField } from './motion'
import { forms } from './particleGeometry'

export default function ParticleDemo() {
  const stage = useRef(null)
  const signals = useRef({ x: 0, y: 0, inside: false, form: 0, scroll: 0, velocity: 0, updated: 0, speed: 1, strength: 1 })
  const [density, setDensity] = useState(8000)
  const [speed, setSpeed] = useState(1)
  const [strength, setStrength] = useState(1)
  const [form, setForm] = useState(0)
  const pointer = usePointerField(stage, signals)

  return <div className="lab-demo">
    <div className="lab-controls">
      <RangeControl label="Particle density" value={density} onChange={setDensity} min={2000} max={14000} step={500} />
      <RangeControl label="Movement speed" value={speed} onChange={value => { signals.current.speed = value; setSpeed(value) }}
        min={0} max={2.5} step={.1} unit="×" />
      <RangeControl label="Pointer strength" value={strength} onChange={value => { signals.current.strength = value; setStrength(value) }}
        min={0} max={2} step={.1} unit="×" />
      <label className="lab-control">Geometry<select value={form} onChange={event => {
        const value = Number(event.target.value)
        signals.current.form = value
        setForm(value)
      }}>{forms.map((name, index) => <option key={name} value={index}>{name}</option>)}</select></label>
      <p className="lab-note">Move a pointer through the field to displace particles. Reduced motion displays a still preview.</p>
    </div>
    <div className="lab-stage lab-particles" ref={stage} {...pointer} aria-label="Particle experiment preview">
      <ParticleField signals={signals} form={form} count={density} interactive demo variant="lab" />
    </div>
  </div>
}
