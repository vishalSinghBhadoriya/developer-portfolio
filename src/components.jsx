import { publicAsset, responsivePublicImage } from './assets'
import { Component, useId, useRef } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { magneticHandlers, useMedia } from './motion'

export class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError?.() }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export function Action({ to, href, children, download, ariaCurrent, ariaLabel, newTab, className = '', onClick, icon = <ArrowUpRight size={17} /> }) {
  const magnetic = useMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
  const props = { className: 'action ' + className, 'aria-current': ariaCurrent, 'aria-label': ariaLabel, onClick, ...magneticHandlers(magnetic) }
  const content = <>{children}{icon}</>
  if (to) return <Link to={to} {...props}>{content}</Link>
  if (href) return <a href={href} download={download} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} {...props}>{content}</a>
  return <button type="button" {...props}>{content}</button>
}

export function SectionLabel({ children, index }) {
  return <p className="section-label mono"><span aria-hidden="true">{index} /</span>{children}</p>
}

export function ProjectImage({ project, sizes = '(max-width: 540px) 72vw, (max-width: 790px) 81vw, 63vw', className }) {
  if (project.capture) {
    const { file, width, height } = project.capture
    return <img className={className} src={publicAsset('projects/' + file)} width={width} height={height}
      alt={project.imageAlt} loading="lazy" decoding="async" />
  }
  const width = project.slug === 'buynest' ? 1440 : 1320
  const height = project.slug === 'buynest' ? 860 : 760
  const base = project.image.replace(/\.[^.]+$/, '')
  const sources = responsivePublicImage(base, [480, 840, width])
  return <img className={className} src={publicAsset(base + '-480.webp')} srcSet={sources} width={width} height={height}
    sizes={sizes} alt={project.name + ' application screenshot'} loading="lazy" decoding="async" />
}

export function Preview({ project, interactive = false }) {
  const media = useMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
  const displacement = useRef(null)
  const filter = 'preview-' + useId().replace(/[^a-z0-9-]/gi, '')
  const enabled = interactive && media
  return <figure className={'preview preview-' + project.theme} data-mask
    style={enabled ? { '--distortion': 'url(#' + filter + ')' } : undefined}
    onPointerMove={event => {
      if (!enabled || event.pointerType === 'touch') return
      const view = event.currentTarget
      const bounds = view.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - .5
      const y = (event.clientY - bounds.top) / bounds.height - .5
      view.style.setProperty('--mx', x * -16 + 'px')
      view.style.setProperty('--my', y * -12 + 'px')
      view.style.setProperty('--light-x', (x + .5) * 100 + '%')
      view.style.setProperty('--light-y', (y + .5) * 100 + '%')
      displacement.current?.setAttribute('scale', 2 + Math.hypot(x, y) * 8)
    }}
    onPointerLeave={event => {
      for (const property of ['--mx', '--my', '--light-x', '--light-y']) event.currentTarget.style.removeProperty(property)
      displacement.current?.setAttribute('scale', 0)
    }}>
    {enabled && <svg className="preview-filter" aria-hidden="true">
      <defs><filter id={filter} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".008 .025" numOctaves="2" result="ripple" />
        <feDisplacementMap ref={displacement} in="SourceGraphic" in2="ripple" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter></defs>
    </svg>}
    <div className="preview-mat">
      <div className="preview-window">
        <div className="window-chrome" aria-hidden="true"><span><i /><i /><i /></span><span>{project.name}</span><ArrowUpRight size={13} /></div>
        <div className="preview-media">
          <ProjectImage project={project} />
        </div>
      </div>
    </div>
  </figure>
}

export function Stack({ items }) {
  return <ul className="stack" aria-label="Technologies">{items.map(item => <li key={item}>{item}</li>)}</ul>
}

export function RangeControl({ label, value, onChange, min, max, step = 1, unit = '' }) {
  return <label className="lab-control">
    <span>{label} <span className="lab-control-value" aria-hidden="true">{value}{unit}</span></span>
    <input type="range" value={value} min={min} max={max} step={step} onChange={event => onChange(Number(event.target.value))} />
  </label>
}
