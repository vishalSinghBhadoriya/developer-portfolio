import { useRef, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, Check, Copy } from 'lucide-react'
import { Action, SectionLabel } from './components'
import { education, experience, profile } from './data'
import ParticleField from './ParticleField'
import { usePointerField } from './motion'

export function About() {
  const [selected, setSelected] = useState(0)
  const principles = [
    ['Build for reuse', 'Reusable React components let the same patterns work across pages without duplicating interface logic.'],
    ['Keep state predictable', 'I keep local state close to the interface and use shared state when multiple parts of the application need it.'],
    ['Give motion a purpose', 'I use motion to make changes in an interface easier to follow, with performance and reduced motion in mind.'],
  ]
  return <section id="about" tabIndex={-1} className="about section">
    <div className="shell">
      <div className="about-head" data-reveal-group>
        <SectionLabel index="02">About me</SectionLabel>
        <h2 data-reveal>Make complexity<br /> <em>feel simple.</em></h2>
      </div>
      <div className="about-composition">
        <div className="experience-stat"><span className="mono">Frontend experience</span>
          <div aria-hidden="true"><strong data-figure="2.5">2.5</strong><span>yrs</span></div>
          <span className="sr-only">2.5 years of frontend experience</span>
          <span className="stat-orbit" aria-hidden="true" />
        </div>
        <div className="about-content" data-reveal-group>
          {profile.portrait && <img className="about-portrait" src={profile.portrait} alt={profile.name} loading="lazy" decoding="async" />}
          <p data-reveal>I’m a frontend developer with 2.5 years of experience building responsive, scalable, and interactive web applications with React.js, TypeScript, and JavaScript. I specialize in reusable component architecture, state management, REST API integration, advanced animations, interactive 3D experiences, and performance-focused user interfaces.</p>
          <div className="philosophy">
            <p className="mono">How I work</p>
            <div className="principle-selector" role="group" aria-label="Developer philosophy">
              {principles.map(([label], index) => <button key={label} type="button" aria-pressed={selected === index}
                onClick={() => setSelected(index)}>{label}</button>)}
            </div>
            <p className="principle-detail" key={selected} role="status">{principles[selected][1]}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
}

export function Journey() {
  return <section id="experience" tabIndex={-1} className="journey section">
    <div className="shell">
      <div className="section-heading" data-reveal-group>
        <SectionLabel index="04">Experience & education</SectionLabel>
        <h2 data-reveal>Professional <em>journey.</em></h2>
      </div>
      <div className="timeline">
        <span className="journey-spine" aria-hidden="true" />
        <article className="journey-item career" data-reveal-group>
          <div className="journey-date mono">July 2024 – Present</div>
          <div>
            <p className="mono" data-reveal>Frontend Developer — React.js &amp; TypeScript · Indore, India</p>
            <h3 data-reveal>JMBliss IT Solutions</h3>
            <div className="achievement-stats">
              {[['15', 'Reusable React components'], ['10', 'REST API endpoints'], ['5', 'Redux Toolkit slices']].map(([amount, label]) =>
                <div key={label}><strong><span data-figure={amount}>{amount}</span>+</strong><span>{label}</span></div>)}
            </div>
            <ul>{experience.map(entry => <li key={entry} data-reveal>{entry}</li>)}</ul>
          </div>
        </article>
        {education.map(([degree, school, year, result]) => <article className="journey-item education-item" key={degree} data-reveal-group>
          <div className="journey-date mono">{year}</div>
          <div><p className="mono" data-reveal>{school}</p><h3 data-reveal>{degree}</h3><p className="education-result" data-reveal>{result}</p></div>
        </article>)}
      </div>
    </div>
  </section>
}

export function Contact() {
  const section = useRef(null)
  const signals = useRef({ x: 0, y: 0, inside: false, form: 0, scroll: 0, velocity: 0, updated: 0 })
  const pointer = usePointerField(section, signals, 26)
  const [status, setStatus] = useState('')
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setStatus('Email copied')
    } catch {
      setStatus('Select the email address to copy it.')
    }
  }
  return <section id="contact" tabIndex={-1} className="contact section" ref={section}
    {...pointer}>
    <div className="contact-particles"><ParticleField signals={signals} interactive variant="contact" /></div>
    <div className="shell contact-copy" data-reveal-group>
      <SectionLabel index="05">Contact</SectionLabel>
      <h2 data-reveal>Let’s build<br /><em>something together.</em></h2>
      <a className="email-address" href={'mailto:' + profile.email} data-reveal>{profile.email}<ArrowUpRight size={19} /></a>
      <div className="contact-actions">
        <Action className="primary" onClick={copyEmail}
          icon={status === 'Email copied' ? <Check size={16} /> : <Copy size={16} />}>Copy email</Action>
        <Action href={profile.resume} download icon={<ArrowDownToLine size={16} />}>Download resume</Action>
        {profile.phone && <Action href={'tel:' + profile.phone}>{profile.phone}</Action>}
      </div>
      <p className="copy-status mono" role="status">{status}</p>
      <div className="contact-social">
        <Action className="text-action" href={profile.github}>GitHub</Action>
        <Action className="text-action" href={profile.linkedin}>LinkedIn</Action>
      </div>
    </div>
  </section>
}
