import { useId, useState } from 'react'
import { Link } from 'react-router'
import { SectionLabel } from './components'
import { projects, skills } from './data'

const nodes = [
  ['React.js', 49, 50, 'Frontend', 'I use component boundaries to keep interface logic reusable across views.'],
  ['JavaScript', 27, 14, 'Frontend', 'ES6+ and browser APIs underpin the behavior of my React applications.'],
  ['Tailwind CSS', 68, 13, 'Frontend', 'Shared utility patterns keep responsive layouts and spacing consistent.'],
  ['Context API', 14, 35, 'State', 'BuyNest uses Context API and LocalStorage for the cart and wishlist.'],
  ['Redux Toolkit', 14, 62, 'State', 'TaskSphere centralizes application state with Redux Toolkit.'],
  ['REST APIs', 75, 33, 'Data', 'Boca En Boca uses REST APIs for job listings, profiles, and authentication.'],
  ['Axios', 89, 56, 'Data', 'I use Axios to connect frontend features with REST endpoints.'],
  ['GSAP', 34, 33, 'Motion', 'ScrollTrigger connects scroll progress to timelines, text reveals, and the particle field.'],
  ['Three.js', 67, 58, 'Motion', 'Custom shaders animate and morph thousands of points in the hero.'],
  ['Framer Motion', 65, 80, 'Motion', 'I use Motion for route transitions and component-level feedback.'],
  ['Chart.js', 88, 78, 'Data', 'TaskSphere uses Chart.js to present dashboard analytics.'],
  ['Git', 21, 84, 'Tooling', 'I use Git to track changes and GitHub Actions for BuyNest deployment.'],
  ['Vite', 42, 87, 'Tooling', 'This portfolio uses Vite for development and splits its WebGL runtime into lazy bundles.'],
]

const detailsByName = {
  'React.js': ['Defines reusable UI and keeps rendering declarative.', ['JavaScript', 'Context API', 'Redux Toolkit'], ['buynest', 'tasksphere', 'boca-en-boca']],
  JavaScript: ['Implements application logic and connects interface events to browser APIs.', ['React.js', 'REST APIs'], ['boca-en-boca']],
  'Tailwind CSS': ['Applies responsive layout and style rules through reusable utilities.', ['React.js', 'Vite'], ['buynest', 'tasksphere']],
  'Context API': ['Shares React state across routes and components.', ['React.js', 'JavaScript'], ['buynest']],
  'Redux Toolkit': ['Organizes shared state into reducers, actions, and slices.', ['React.js', 'Axios'], ['tasksphere', 'playground']],
  'REST APIs': ['Represent remote resources behind HTTP endpoints.', ['Axios', 'JavaScript'], ['tasksphere', 'boca-en-boca']],
  Axios: ['Centralizes HTTP request setup and interception.', ['REST APIs', 'Redux Toolkit'], ['tasksphere']],
  GSAP: ['Sequences timelines and synchronizes animation with scroll.', ['Three.js', 'Framer Motion'], ['playground']],
  'Three.js': ['Renders shader-driven objects and particles through WebGL.', ['GSAP', 'React.js'], ['playground']],
  'Framer Motion': ['Coordinates React component transitions and interaction feedback.', ['React.js', 'GSAP'], ['buynest']],
  'Chart.js': ['Turns data series into dashboard visualizations.', ['Axios', 'React.js'], ['tasksphere']],
  Git: ['Tracks changes in source and supports deployment workflows.', ['Vite', 'JavaScript'], ['buynest']],
  Vite: ['Runs development builds and bundles production code.', ['Git', 'React.js'], ['buynest', 'playground']],
}

export default function Toolkit() {
  const [selected, setSelected] = useState(0)
  const [preview, setPreview] = useState(null)
  const active = preview ?? selected
  const [label, x, y, group, detail] = nodes[active]
  const [purpose, related, examples] = detailsByName[label]
  const [hub, cx, cy] = nodes[0]
  const id = useId()

  return <section id="toolkit" tabIndex={-1} className="toolkit section">
    <div className="shell">
      <div className="section-heading" data-reveal-group>
        <SectionLabel index="03">Technical ecosystem</SectionLabel>
        <h2 data-reveal>The <em>toolkit.</em></h2>
        <p data-reveal>Select a technology to see how I use it.</p>
      </div>
      <div className="ecosystem">
        <div className="network" aria-label="Technologies" onPointerLeave={() => setPreview(null)}>
          <svg className="network-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {nodes.slice(1).map(([name, nx, ny], index) => <line key={name} x1={cx} y1={cy} x2={nx} y2={ny}
              className={active === index + 1 || active === 0 ? 'is-linked' : ''} />)}
            {active > 0 && nodes.filter(([name]) => related.includes(name) && name !== hub).map(([name, nx, ny]) =>
              <line className="is-linked is-crosslink" x1={x} y1={y} x2={nx} y2={ny} key={'related-' + name} />)}
            {active > 0 && <circle cx={x} cy={y} r="2.8" key={active} />}
          </svg>
          {nodes.map(([name, nx, ny], index) => <button key={name} type="button"
            className={'tech-node' + (name === hub ? ' tech-hub' : '') + (active === index ? ' is-active' : related.includes(name) ? ' is-related' : '')}
            style={{ '--x': nx + '%', '--y': ny + '%' }} aria-pressed={selected === index}
            aria-controls={id} onPointerEnter={event => { if (event.pointerType !== 'touch') setPreview(index) }}
            onFocus={() => setPreview(index)} onBlur={() => setPreview(null)} onClick={() => { setSelected(index); setPreview(null) }}>
            <i aria-hidden="true" />{name}
          </button>)}
        </div>
        <div className="tech-detail" id={id} tabIndex={-1} aria-live="polite">
                    <div key={label}>
            <p className="mono">{group}</p><h3>{label}</h3><p>{purpose}</p><p className="tech-usage">{detail}</p>
            <div className="tech-relationship"><p className="mono">Related technologies</p><ul>
              {related.map(name => <li key={name}><button type="button" onClick={() => {
                setSelected(nodes.findIndex(([item]) => item === name))
                setPreview(null)
                requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }))
              }}>{name}</button></li>)}
            </ul></div>
            <div className="tech-relationship"><p className="mono">Project examples</p><ul>
              {examples.map(slug => <li key={slug}><Link to={slug === 'playground' ? '/playground' : '/work/' + slug}>
                {projects.find(project => project.slug === slug)?.name ?? 'Developer Playground'}
              </Link></li>)}
            </ul></div>
          </div>
        </div>
      </div>
      <div className="additional-skills" aria-label="Additional technical skills">
        {skills.flatMap(([, items]) => items).filter(item =>
          !nodes.some(([name]) => name === item || item.startsWith(name + ' ('))
        ).map(item => <span key={item}>{item}</span>)}
      </div>
    </div>
  </section>
}
