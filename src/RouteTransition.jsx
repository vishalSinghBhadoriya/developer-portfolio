import { domAnimation, LazyMotion, m } from 'framer-motion'

export default function RouteTransition() {
  return <LazyMotion features={domAnimation}>
    <m.div aria-hidden="true" className="route-transition" initial={{ opacity: .54 }} animate={{ opacity: 0 }}
      transition={{ duration: .36, ease: 'easeOut' }} />
  </LazyMotion>
}
