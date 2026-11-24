import { buyNestMedia } from './assets'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Action, Preview, SectionLabel, Stack } from './components'
import { caseDetails } from './caseDetails'
import { projects } from './data'
import { useEditorialMotion } from './motion'

function Architecture({ nodes }) {
  const [active, setActive] = useState(0)
  return <section className="case-architecture" aria-labelledby="architecture-title">
    <h2 id="architecture-title">Technical <em>architecture.</em></h2>
    <ol className="architecture-flow" aria-label="Explore the project architecture">
      {nodes.map(([label], index) => <li key={label}>
        <button type="button" aria-pressed={active === index} onClick={() => setActive(index)}>
          <span className="mono">0{index + 1}</span>{label}
        </button>
        {index < nodes.length - 1 && <span className="architecture-edge" aria-hidden="true"><ArrowRight size={18} /></span>}
      </li>)}
    </ol>
    <div className="architecture-detail" role="status" key={active}><strong>{nodes[active][0]}</strong><p>{nodes[active][1]}</p></div>
  </section>
}

export default function CaseStudy() {
  const { slug } = useParams()
  const index = projects.findIndex(project => project.slug === slug)
  const project = projects[index]
  const details = caseDetails[slug]
  const scope = useRef(null)
  useEditorialMotion(scope, slug)

  useEffect(() => {
    const previous = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description.content
    document.title = (project?.name ?? 'Page not found') + ' | Vishal Bhadoriya'
    if (project) description.content = project.summary
    document.getElementById('main')?.focus({ preventScroll: true })
    return () => { document.title = previous; description.content = previousDescription }
  }, [project])

  if (!project) return <main id="main" tabIndex={-1} className="case shell" ref={scope}>
    <h1>Page not found.</h1><Action to="/#work">Back to selected work</Action>
  </main>

  const next = projects[(index + 1) % projects.length]
  return <main id="main" tabIndex={-1} className="case shell" ref={scope}>
    <Action className="text-action case-back" to="/#work" icon={<ArrowLeft size={17} />}>Selected work</Action>
    <header className="case-heading">
      <div><SectionLabel index={'0' + (index + 1)}>{project.type}</SectionLabel><h1>{project.name}<em>.</em></h1></div>
      <div><p className="case-summary">{project.summary}</p><Stack items={project.stack} />
        <div className="project-actions">
          <Action className="primary" href={project.url}>Visit live project</Action>
          {details.source && <Action href={details.source}>Source code</Action>}
        </div></div>
    </header>
    <Preview project={project} interactive />
    {slug === 'buynest' && <div className="case-captures" aria-label="More BuyNest screenshots">
      <figure><img src={buyNestMedia.mobile} width="390" height="780" loading="lazy"
        alt="BuyNest storefront on mobile" /><figcaption>Mobile storefront</figcaption></figure>
      <figure><img src={buyNestMedia.product} srcSet={buyNestMedia.productSrcSet} sizes="(max-width: 790px) 65vw, 60vw" width="1320" height="780" loading="lazy"
        alt="BuyNest product detail screen" /><figcaption>Product detail</figcaption></figure>
    </div>}
    <section className="case-intro" data-reveal-group>
      <div data-reveal><h2>Overview.</h2><p>{project.summary}</p></div>
      <div data-reveal><h2>The problem.</h2><p>{details.problem}</p></div>
    </section>
    <Architecture nodes={details.architecture} />
    <section className="case-decisions">
      <h2>Implementation <em>decisions.</em></h2>
      <dl>{details.decisions.map(([title, detail]) => <div key={title} data-reveal-group>
        <dt data-reveal>{title}</dt><dd data-reveal>{detail}</dd>
      </div>)}</dl>
    </section>
    <section className="case-details">
      <h2>What I <em>built.</em></h2>
      <ol>{project.features.map((feature, number) => <li key={feature}><span className="mono" aria-hidden="true">0{number + 1}</span>{feature}</li>)}</ol>
    </section>
    <Action to={'/work/' + next.slug}>Next project · {next.name}</Action>
  </main>
}
