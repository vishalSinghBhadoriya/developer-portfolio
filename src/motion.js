import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export function useMedia(query) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const media = matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [query])
  return matches
}

export function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ smoothWheel: true, duration: 1 })
    const frame = (time) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(frame)
    return () => {
      gsap.ticker.remove(frame)
      lenis.destroy()
    }
  }, [enabled])
}

export function magneticHandlers(enabled) {
  return {
    onPointerMove(event) {
      if (!enabled || event.pointerType === 'touch') return
      const element = event.currentTarget
      const bounds = element.getBoundingClientRect()
      const x = event.clientX - bounds.left - bounds.width / 2
      const y = event.clientY - bounds.top - bounds.height / 2
      element.style.setProperty('--mx', x * 0.17 + 'px')
      element.style.setProperty('--my', y * 0.21 + 'px')
    },
    onPointerLeave(event) {
      event.currentTarget.style.removeProperty('--mx')
      event.currentTarget.style.removeProperty('--my')
    },
  }
}

export function useEditorialMotion(scope, page) {
  useLayoutEffect(() => {
    const root = scope.current
    const media = gsap.matchMedia()
    const wide = '(min-width: 850px)'
    const permitted = '(prefers-reduced-motion: no-preference)'

    media.add(wide + ' and ' + permitted, () => {
      const hero = root.querySelector('.hero')
      if (!hero || scrollY >= innerHeight) return
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from(hero.querySelectorAll('[data-letter]'), { yPercent: 112, rotate: 8, duration: .92, stagger: .021 })
        .from(hero.querySelectorAll('[data-hero-note]'), { y: 12, opacity: 0, duration: .42, stagger: .1 }, .24)
    }, root)

    function setup() {
      media.add({ wide, narrow: '(max-width: 849px)', permitted }, context => {
        if (!context.conditions.permitted) return
        const desktop = context.conditions.wide
        const callbacks = new Map()
        const observer = desktop ? null : new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            observer.unobserve(entry.target)
            context.add(callbacks.get(entry.target))
            callbacks.delete(entry.target)
          }
        }, { rootMargin: '0px 0px -10% 0px' })

        function reveal(element, animation, start = 'top 88%') {
          if (observer) {
            callbacks.set(element, () => animation(undefined))
            observer.observe(element)
          } else animation({ trigger: element, start, once: true })
        }

        root.querySelectorAll('[data-reveal-group]').forEach(group => {
          reveal(group, scrollTrigger => gsap.from(group.querySelectorAll('[data-reveal]'), {
            y: 23, opacity: .55, duration: .64, stagger: .095, ease: 'power2.out',
            immediateRender: !scrollTrigger, scrollTrigger,
          }))
        })

        root.querySelectorAll('[data-mask]').forEach(element => {
          reveal(element, scrollTrigger => gsap.from(element, {
            clipPath: 'inset(13% 0 0 0)', duration: .9, ease: 'power3.out',
            immediateRender: !scrollTrigger, scrollTrigger,
          }), 'top 91%')
        })

        root.querySelectorAll('[data-figure], [data-index]').forEach(element => {
          const isIndex = element.hasAttribute('data-index')
          const destination = Number(isIndex ? element.dataset.index : element.dataset.figure)
          const digits = destination % 1 ? 1 : 0
          const print = value => isIndex ? String(Math.round(value)).padStart(2, '0') : value.toFixed(digits)
          const state = { value: 0 }
          reveal(element, scrollTrigger => gsap.to(state, {
            value: destination, duration: isIndex ? .57 : 1.16, ease: 'power2.out', scrollTrigger,
            onUpdate: () => { element.textContent = print(state.value) },
            onComplete: () => { element.textContent = print(destination) },
          }), 'top 91%')
        })

        const timeline = root.querySelector('.journey-spine')
        if (timeline) {
          if (desktop) gsap.fromTo(timeline, { scaleY: 0 }, {
            scaleY: 1, ease: 'none',
            scrollTrigger: { trigger: timeline.parentElement, start: 'top 65%', end: 'bottom 65%', scrub: true },
          })
          else reveal(timeline.parentElement, () => gsap.fromTo(timeline, { scaleY: 0 }, { scaleY: 1, duration: .7 }))
        }

        if (desktop) root.querySelectorAll('[data-parallax]').forEach(element => {
          gsap.to(element, { y: -20, ease: 'none',
            scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom 25%', scrub: .55 } })
        })

        return () => {
          observer?.disconnect()
          root.querySelectorAll('[data-figure]').forEach(element => { element.textContent = element.dataset.figure })
          root.querySelectorAll('[data-index]').forEach(element => { element.textContent = element.dataset.index.padStart(2, '0') })
        }
      }, root)
    }

    const idle = typeof window.requestIdleCallback === 'function'
    const job = idle ? window.requestIdleCallback(setup, { timeout: 1100 }) : window.setTimeout(setup, 160)
    let active = true
    let frame
    document.fonts.ready.then(() => {
      if (active && matchMedia(wide).matches) frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    return () => {
      active = false
      if (idle) window.cancelIdleCallback(job)
      else window.clearTimeout(job)
      cancelAnimationFrame(frame)
      media.revert()
    }
  }, [scope, page])
}

export function useParticleScroll(scope, signals) {
  useEffect(() => {
    const media = gsap.matchMedia()
    media.add(
      '(min-width: 950px) and (prefers-reduced-motion: no-preference)',
      () => {
        ScrollTrigger.create({
          trigger: scope.current,
          start: 'top top',
          end: 'bottom 12%',
          onUpdate(self) {
            signals.current.scroll = self.progress
            signals.current.updated = performance.now()
            signals.current.velocity = Math.min(
              1,
              Math.abs(self.getVelocity()) / 2200,
            )
          },
          onRefresh(self) {
            signals.current.scroll = self.progress
          },
        })
      },
    )
    return () => media.revert()
  }, [scope, signals])
}

export function usePointerField(scope, signals, parallax) {
  const moving = useMedia('(prefers-reduced-motion: no-preference)')
  return {
    onPointerMove(event) {
      if (!moving || (event.pointerType === 'touch' && event.buttons === 0))
        return
      const bounds = scope.current.getBoundingClientRect()
      const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      const y = 1 - ((event.clientY - bounds.top) / bounds.height) * 2
      const input = signals.current
      input.x = Math.max(-1, Math.min(1, x))
      input.y = Math.max(-1, Math.min(1, y))
      input.inside = Math.abs(x) <= 1.1 && Math.abs(y) <= 1.1
      if (parallax) {
        scope.current.style.setProperty('--px', input.x * parallax + 'px')
        scope.current.style.setProperty('--py', -input.y * parallax + 'px')
      }
    },
    onPointerLeave() {
      signals.current.inside = false
      if (!parallax) return
      scope.current?.style.removeProperty('--px')
      scope.current?.style.removeProperty('--py')
    },
    onPointerUp(event) {
      if (event.pointerType === 'touch') signals.current.inside = false
    },
    onPointerCancel() {
      signals.current.inside = false
    },
  }
}

export function useScramble(target) {
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const frame = useRef(0)
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  return (text) => {
    cancelAnimationFrame(frame.current)
    const label = target.current
    if (!label) return
    if (reduced) {
      label.textContent = text
      return
    }
    const start = performance.now()
    const characters = '01+<>:#'
    const animate = (time) => {
      const progress = Math.min(1, (time - start) / 290)
      label.textContent = Array.from(text, (letter, position) =>
        position < progress * text.length || letter === ' '
          ? letter
          : characters[Math.floor(Math.random() * characters.length)],
      ).join('')
      if (progress < 1) frame.current = requestAnimationFrame(animate)
    }
    frame.current = requestAnimationFrame(animate)
  }
}

export function useAmbientScroll(scope) {
  useEffect(() => {
    const media = gsap.matchMedia()
    const root = scope.current
    media.add(
      '(min-width: 850px) and (prefers-reduced-motion: no-preference)',
      () => {
        gsap.to(root, {
          '--ambient-x': '82%',
          '--ambient-y': '78%',
          '--ambient-angle': '225deg',
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.65,
          },
        })
      },
      root,
    )
    return () => media.revert()
  }, [scope])
}
