import { playgroundPath } from './routePaths'
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router'
import { ArrowDown, ArrowUp, ArrowUpRight, Command, Menu, X } from 'lucide-react'
import { Action, ErrorBoundary } from './components'
import { profile } from './data'
import { magneticHandlers, useMedia, useSmoothScroll } from './motion'
import Home from './Home'
import CommandPalette from './CommandPalette'

const CaseStudy = lazy(() => import('./CaseStudy'))
const Playground = lazy(() => import('./Playground'))
const RouteTransition = lazy(() => import('./RouteTransition'))
const sections = [
  ['Work', 'work'], ['About', 'about'], ['Toolkit', 'toolkit'], ['Journey', 'experience'], ['Contact', 'contact'],
]

function Header({ reduced, pointer, onCommand, commandOpen }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const activeRef = useRef('')
  const menu = useRef(null)
  const toggle = useRef(null)
  const surface = useRef(null)
  const progress = useRef(null)
  const { pathname, hash } = useLocation()
  const magnetic = magneticHandlers(!reduced && pointer)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const travel = document.documentElement.scrollHeight - innerHeight
      progress.current.style.setProperty('--progress', travel > 0 ? Math.min(1, scrollY / travel) : 0)
      surface.current.dataset.scrolled = scrollY > 28
      let next = pathname.startsWith('/work/') ? 'work' : ''
      const marker = innerHeight * .44
      for (const [, id] of sections) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= marker) next = id
      }
      if (pathname === '/' && travel > 0 && scrollY >= travel - 4) next = 'contact'
      if (activeRef.current !== next) {
        activeRef.current = next
        setActive(next)
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [pathname])

  useEffect(() => {
    if (commandOpen && open) { setOpen(false); return }
    if (open && !menu.current.open) menu.current.showModal()
    if (!open && menu.current.open) menu.current.close()
  }, [open, commandOpen])

  const close = restore => {
    setOpen(false)
    if (restore) requestAnimationFrame(() => toggle.current?.focus())
  }

  return <header className="site-header">
    <div className="navigation" ref={surface}>
      <Link className="brand" to="/" aria-label="VB. Vishal Bhadoriya home" onClick={() => {
        if (pathname === '/' && !hash) window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })
      }}>
        <span className="brand-mark" aria-hidden="true">VB<span>.</span></span>
        <span className="brand-name">Vishal<br />Bhadoriya</span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {sections.slice(0, -1).map(([label, id]) => <Link key={id} to={'/#' + id}
          aria-current={active === id ? 'location' : undefined} {...magnetic}>{label}</Link>)}
        <Link className="nav-playground" to={playgroundPath} aria-current={pathname === playgroundPath ? 'page' : undefined} {...magnetic}>Playground</Link>
      </nav>
      <div className="nav-actions">
        <button type="button" className="command-trigger" aria-label="Open command palette" aria-haspopup="dialog"
          aria-expanded={commandOpen} aria-keyshortcuts="Control+K Meta+K" onClick={onCommand}><Command size={16} /><kbd>K</kbd></button>
        <Action className={'nav-contact' + (active === 'contact' ? ' is-current' : '')} to="/#contact" ariaCurrent={active === 'contact' ? 'location' : undefined}>Contact</Action>
        <button className="menu-toggle" ref={toggle} onClick={() => setOpen(true)}
          aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={open}><Menu size={20} /></button>
      </div>
      <div className="progress" ref={progress} aria-hidden="true" />
    </div>
    <dialog ref={menu} className="nav-overlay" data-lenis-prevent aria-label="Site navigation"
      onClose={() => setOpen(false)} onCancel={event => { event.preventDefault(); close(true) }}>
      <div className="overlay-inner">
        <div className="overlay-top"><span className="brand-mark" aria-hidden="true">VB<span>.</span></span>
          <button className="menu-toggle" onClick={() => close(true)} aria-label="Close navigation"><X /></button>
        </div>
        <nav aria-label="Overlay navigation">{sections.map(([label, id], index) => <Link key={id}
          to={'/#' + id} onClick={() => close(false)} aria-current={active === id ? 'location' : undefined}
          style={{ '--item': index }}><span>0{index + 1}</span>{label}<ArrowUpRight /></Link>)}
          <Link to={playgroundPath} onClick={() => close(false)} style={{ '--item': 5 }}><span>06</span>Playground<ArrowUpRight /></Link>
        </nav>
        <a className="mono overlay-email" href={'mailto:' + profile.email}>{profile.email}</a>
      </div>
    </dialog>
  </header>
}

function Cursor({ enabled }) {
  const element = useRef(null)
  useEffect(() => {
    if (!enabled) return
    const cursor = element.current
    const move = event => {
      const target = event.target instanceof Element ? event.target : null
      cursor.style.translate = event.clientX + 'px ' + event.clientY + 'px'
      cursor.dataset.state = target?.closest('.project-preview-link') ? 'preview' : target?.closest('a,button') ? 'active' : 'default'
      cursor.style.opacity = '1'
    }
    const hide = () => { cursor.style.opacity = '0' }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
    }
  }, [enabled])
  return enabled && <span ref={element} className="cursor" aria-hidden="true"><ArrowUpRight size={16} /></span>
}

function Footer({ reduced }) {
  return <footer className="footer">
    <div className="shell">
      <div className="footer-links mono">
        <span>© {new Date().getFullYear()} Vishal Bhadoriya</span>
        <div><a href={profile.github}>GitHub ↗</a><a href={profile.linkedin}>LinkedIn ↗</a></div>
        <Action className="text-action" onClick={() => {
          document.querySelector('.brand')?.focus({ preventScroll: true })
          window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })
        }} icon={<ArrowUp size={16} />}>Back to top</Action>
      </div>
      <p className="footer-name" aria-hidden="true">Vishal Bhadoriya<span>.</span></p>
    </div>
  </footer>
}

function StartupReady() {
  useLayoutEffect(() => {
    const loader = document.getElementById('startup-loader')
    if (!loader || loader.dataset.leaving) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !loader.animate) {
      loader.remove()
      return
    }
    loader.dataset.leaving = 'true'
    loader.setAttribute('aria-hidden', 'true')
    const remove = () => loader.remove()
    loader.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 220, easing: 'ease-out', fill: 'forwards',
    }).finished.then(remove, remove)
  }, [])
  return null
}

export default function App() {
  const location = useLocation()
  const previous = useRef(null)
  const [commandOpen, setCommandOpen] = useState(false)
  useEffect(() => {
    const keyboard = event => {
      if (event.repeat || event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey) || event.altKey) return
      event.preventDefault()
      setCommandOpen(value => !value)
    }
    window.addEventListener('keydown', keyboard)
    return () => window.removeEventListener('keydown', keyboard)
  }, [])
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const pointer = useMedia('(min-width: 850px) and (pointer: fine)')
  useSmoothScroll(!reduced && pointer)

  useEffect(() => {
    let frame
    let attempts = 0
    const id = location.hash.slice(1)
    const smooth = previous.current === location.pathname && !matchMedia('(prefers-reduced-motion: reduce)').matches
    previous.current = location.pathname
    const navigate = () => {
      const target = document.getElementById(id)
      if (target) {
        target.focus({ preventScroll: true })
        target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
      } else if (id && attempts++ < 90) frame = requestAnimationFrame(navigate)
      else if (!id) window.scrollTo({ top: 0, behavior: 'instant' })
    }
    frame = requestAnimationFrame(navigate)
    return () => cancelAnimationFrame(frame)
  }, [location])

  return <>
    <a className="skip" href="#main">Skip to content <ArrowDown size={15} /></a>
    <Header reduced={reduced} pointer={pointer} commandOpen={commandOpen} onCommand={() => setCommandOpen(true)} />
    <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    <Cursor enabled={pointer && !reduced} />
    <ErrorBoundary key={location.pathname} fallback={<main id="main" className="case shell"><StartupReady /><h1>Something went wrong.</h1><Action href={import.meta.env.BASE_URL}>Reload the portfolio</Action></main>}>
      <div key={location.pathname} className="route-view">
        {!reduced && location.pathname !== '/' &&
          <Suspense fallback={null}><RouteTransition /></Suspense>}
        <Suspense fallback={<main id="main" className="case shell" aria-busy="true">Loading page…</main>}>
          <StartupReady />
          <Routes location={location}>
            <Route index element={<Home />} />
            <Route path="work/:slug" element={<CaseStudy />} />
            <Route path={playgroundPath} element={<Playground />} />
            <Route path="*" element={<CaseStudy />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
    <Footer reduced={reduced} />
  </>
}
