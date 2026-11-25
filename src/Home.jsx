import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowDown, ArrowDownToLine } from 'lucide-react'
import { Action } from './components'
import { profile } from './data'
import ParticleField from './ParticleField'
import { forms } from './particleGeometry'
import { useAmbientScroll, useEditorialMotion, useParticleScroll, usePointerField, useScramble } from './motion'
import { About, Contact, Journey } from './sections'
import Work from './ProjectStories'
import Toolkit from './Toolkit'

const headline = ['Interfaces', 'in motion.']
const defaultHeroForm = forms.indexOf('Geometry')

function Hero() {
  const area = useRef(null)
  const art = useRef(null)
  const formLabel = useRef(null)
  const input = useRef({ x: 0, y: 0, inside: false, form: defaultHeroForm, scroll: 0, velocity: 0, updated: 0 })
  const [form, setForm] = useState(defaultHeroForm)
  const pointer = usePointerField(art, input, 12)
  const scramble = useScramble(formLabel)
  useParticleScroll(area, input)

  function choose(index) {
    input.current.form = index
    setForm(index)
    scramble(index === null ? 'SCROLL MORPH' : forms[index].toUpperCase())
  }

  return <section className="hero" ref={area} {...pointer} aria-label="Introduction">
    <div className="hero-art" ref={art}>
      <ParticleField signals={input} form={form ?? 0} interactive />
    </div>
    <div className="hero-grid" aria-hidden="true" />
    <div className="hero-content shell">
      <div className="identity" data-hero-note><strong>{profile.name}</strong><span className="mono"><i /> Frontend Developer — React.js &amp; TypeScript</span></div>
      <div className="hero-copy">
        <h1 aria-label="Interfaces in motion.">
          {headline.map((line, index) => <span className={'headline-line line-' + index} key={line} aria-hidden="true">
            {line.split(' ').map(word => <span className="headline-word" key={word}>
              {Array.from(word, (letter, position) => <span data-letter key={position}>{letter}</span>)}
            </span>)}
          </span>)}
        </h1>
        <p className="hero-description" data-hero-note>I build responsive React and TypeScript applications, from real estate discovery to interactive automotive and e-commerce experiences.</p>
        <div className="hero-actions" data-hero-note>
          <Action className="primary" to="/#work" icon={<ArrowDown size={16} />}>Explore work</Action>
          <Action href={profile.resume} download icon={<ArrowDownToLine size={16} />}>Download resume</Action>
        </div>
      </div>
      <div className="hero-base mono">
        <Link to="/#work"><ArrowDown size={13} /> Scroll to explore</Link>
        <div className="form-select" role="group" aria-label="Particle form">
          <button type="button" aria-label="Auto scroll morph" aria-pressed={form === null} onClick={() => choose(null)}>Auto</button>
          {forms.map((name, index) => <button type="button" key={name} aria-pressed={form === index} onClick={() => choose(index)}>{name}</button>)}
        </div>
        <span className="hero-mode" ref={formLabel} aria-hidden="true">{forms[defaultHeroForm].toUpperCase()}</span>
      </div>
    </div>
  </section>
}

export default function Home() {
  const scope = useRef(null)
  useEditorialMotion(scope)
  useAmbientScroll(scope)
  return <main id="main" tabIndex={-1} className="portfolio-main" ref={scope}>
    <Hero />
    <Work />
    <About />
    <section className="playground-entry shell" aria-labelledby="playground-entry-title" data-reveal-group>
      <div><p className="mono entry-kicker">Interactive experiments</p><h2 id="playground-entry-title" data-reveal>Developer <em>Playground.</em></h2></div>
      <div data-reveal><p>Adjust a shader, dispatch a Redux action, or step through a sort.</p>
        <Action className="primary" to="/playground">Open playground</Action></div>
    </section>
    <Toolkit />
    <Journey />
    <Contact />
  </main>
}
