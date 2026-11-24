import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Activity, ArrowLeft, Binary, Boxes, Search, SlidersHorizontal } from 'lucide-react'
import gsap from 'gsap'
import { Action, ErrorBoundary, RangeControl } from './components'
import { projects, skills } from './data'
import { useMedia } from './motion'

const ParticleDemo = lazy(() => import('./ParticleDemo'))
const ReduxDemo = lazy(() => import('./ReduxDemo'))
const topics = [...new Set([...projects.map(project => project.name), ...skills.flatMap(([, names]) => names)])]
const sets = [[46, 81, 23, 68, 39, 95, 18, 56, 74, 34], [82, 15, 53, 68, 31, 48, 91, 63, 20, 37]]

function AnimationDemo() {
  const stage = useRef(null)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const [duration, setDuration] = useState(.8)
  const [stagger, setStagger] = useState(.09)
  const [ease, setEase] = useState('power3.out')
  const [replay, setReplay] = useState(0)
  const [sequence, setSequence] = useState(false)

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ onStart: () => setSequence(true), onComplete: () => setSequence(false) })
      timeline.fromTo('.gsap-tile', { xPercent: 0, rotate: 0 },
        { xPercent: 230, rotate: 180, duration: reduced ? 0 : duration,
          stagger: reduced ? 0 : stagger, ease })
    }, stage)
    return () => context.revert()
  }, [duration, stagger, ease, replay, reduced])

  return <div className="lab-demo">
    <div className="lab-controls">
      <RangeControl label="Duration" value={duration} onChange={setDuration} min={.2} max={2} step={.1} unit=" s" />
      <RangeControl label="Stagger" value={stagger} onChange={setStagger} min={0} max={.3} step={.01} unit=" s" />
      <label className="lab-control">Easing<select value={ease} onChange={event => setEase(event.target.value)}>
        <option value="power3.out">Power out</option><option value="sine.inOut">Sine in/out</option>
        <option value="back.out(1.7)">Back out</option><option value="bounce.out">Bounce out</option>
        <option value="none">Linear</option>
      </select></label>
      <Action onClick={() => setReplay(value => value + 1)}>Replay animation</Action>
    </div>
    <div className="lab-stage gsap-stage" ref={stage} aria-label={sequence ? 'Animation running' : 'Animation complete'}>
      {Array.from({ length: 5 }, (_, index) => <div key={index}><span className="gsap-tile" /></div>)}
    </div>
  </div>
}

function useDebouncedValue(value, duration) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), duration)
    return () => clearTimeout(id)
  }, [value, duration])
  return debounced
}

function SearchResults({ name, query }) {
  const items = topics.filter(item => item.toLowerCase().includes(query.trim().toLowerCase()))
  return <div className="lab-results"><h3>{name}</h3>
    <p className="mono" aria-live="polite">{items.length} {items.length === 1 ? 'result' : 'results'} · {query || 'All technologies'}</p>
    <ul>{items.slice(0, 9).map(item => <li key={item}>{item}</li>)}</ul></div>
}

function DebounceDemo() {
  const [query, setQuery] = useState('')
  const [delay, setDelay] = useState(500)
  const delayed = useDebouncedValue(query, delay)
  return <div className="debounce-demo">
    <div className="lab-controls">
      <label className="lab-control">Search projects and technologies<input type="search" value={query}
        placeholder="Try React or GSAP" onChange={event => setQuery(event.target.value)} /></label>
      <RangeControl label="Debounce delay" value={delay} onChange={setDelay} min={100} max={1400} step={100} unit=" ms" />
      <p className="lab-note">Immediate results update on every keystroke. Debounced results wait until you stop typing.</p>
    </div>
    <div className="lab-comparison"><SearchResults name="Immediate" query={query} /><SearchResults name="Debounced" query={delayed} /></div>
  </div>
}

function* bubbleSort(values) {
  const sorted = [...values]
  for (let end = sorted.length - 1; end > 0; end--) {
    let swapped = false
    for (let index = 0; index < end; index++) {
      yield { values: [...sorted], pair: [index, index + 1], action: 'Comparing' }
      if (sorted[index] > sorted[index + 1]) {
        [sorted[index], sorted[index + 1]] = [sorted[index + 1], sorted[index]]
        swapped = true
        yield { values: [...sorted], pair: [index, index + 1], action: 'Swapped' }
      }
    }
    if (!swapped) break
  }
  return { values: sorted, pair: [], action: 'Sorted' }
}

function SortingDemo() {
  const [speed, setSpeed] = useState(6)
  const [set, setSet] = useState(0)
  const [state, setState] = useState({ values: sets[0], pair: [], action: 'Ready' })
  const [running, setRunning] = useState(false)
  const [steps, setSteps] = useState(0)
  const iterator = useRef(null)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')

  const step = useCallback(() => {
    const next = iterator.current?.next()
    if (!next) return
    setState(next.value)
    if (next.done) {
      iterator.current = null
      setRunning(false)
    } else setSteps(value => value + 1)
  }, [])

  useEffect(() => {
    if (!running || reduced) return
    const timer = setInterval(step, 1000 / speed)
    return () => clearInterval(timer)
  }, [running, reduced, speed, step])

  function reset() {
    const next = (set + 1) % sets.length
    iterator.current = null
    setSet(next)
    setState({ values: sets[next], pair: [], action: 'Ready' })
    setSteps(0)
    setRunning(false)
  }

  return <div className="lab-demo">
    <div className="lab-controls">
      <RangeControl label="Steps per second" value={speed} onChange={setSpeed} min={1} max={20} />
      <p className="lab-note">Bubble sort compares neighbors and swaps them when they are out of order.</p>
      <div className="lab-actions">
        {!reduced && <Action onClick={() => {
          if (running) { setRunning(false); return }
          if (!iterator.current) { iterator.current = bubbleSort(sets[set]); setSteps(0) }
          setRunning(true)
        }}>{running ? 'Pause sort' : 'Run sort'}</Action>}
        <Action onClick={() => {
          if (!iterator.current) { iterator.current = bubbleSort(sets[set]); setSteps(0) }
          setRunning(false)
          step()
        }}>Step once</Action>
        <Action onClick={reset}>Reset data</Action>
      </div>
      <p className="mono" role="status">{state.action} · {steps} steps</p>
    </div>
    <ol className="lab-stage sorting-stage" aria-label="Current sequence">
      {state.values.map((value, index) => <li key={index} data-active={state.pair.includes(index)}
        style={{ '--bar': value + '%' }}><span>{value}</span></li>)}
    </ol>
  </div>
}

const labs = [
  ['GSAP', Activity, AnimationDemo, 'Tune a GSAP timeline and see how timing, easing, and stagger affect the same motion.'],
  ['Particles', SlidersHorizontal, ParticleDemo, 'Control the same GPU particle simulation used on the homepage.'],
  ['Redux Toolkit', Boxes, ReduxDemo, 'Dispatch actions and watch a real Redux store update.'],
  ['Debounced search', Search, DebounceDemo, 'Compare immediate input handling with a delayed update.'],
  ['Sorting', Binary, SortingDemo, 'Watch bubble sort compare and exchange values one step at a time.'],
]

export default function Playground() {
  const [index, setIndex] = useState(0)
  const [name, , Demo, description] = labs[index]
  useEffect(() => {
    const previous = document.title
    document.title = 'Developer Playground | Vishal Bhadoriya'
    document.getElementById('main')?.focus({ preventScroll: true })
    return () => { document.title = previous }
  }, [])

  return <main className="lab shell" id="main" tabIndex={-1}>
    <Link className="case-back lab-back" to="/"><ArrowLeft size={16} /> Portfolio</Link>
    <header className="lab-heading"><h1>Developer <em>Playground.</em></h1>
      <p>Five working experiments in motion, rendering, state, input handling, and algorithms.</p></header>
    <div className="lab-tabs" role="group" aria-label="Choose an experiment">
      {labs.map(([label, Icon], position) => <button key={label} type="button" aria-pressed={index === position}
        onClick={() => setIndex(position)}><Icon size={16} aria-hidden="true" />{label}</button>)}
    </div>
    <section className="lab-panel" aria-label={name}><header><h2>{name}</h2><p>{description}</p></header>
      <ErrorBoundary key={name} fallback={<p>This experiment could not load. Select another tab or reload the page.</p>}>
        <Suspense fallback={<p role="status">Loading experiment…</p>}><Demo /></Suspense>
      </ErrorBoundary>
    </section>
  </main>
}
