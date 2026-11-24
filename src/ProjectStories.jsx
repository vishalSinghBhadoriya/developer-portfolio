import { buyNestMedia } from './assets'
import { useState } from 'react'
import { Link } from 'react-router'
import { Activity, ArrowUpRight, ShoppingBag, Smartphone } from 'lucide-react'
import { Action, Preview, ProjectImage, SectionLabel, Stack } from './components'
import { projects } from './data'

function ScreenshotLink({ project }) {
  return <Link className="project-preview-link" to={'/work/' + project.slug} aria-label={'Open ' + project.name + ' case study'}>
    <Preview project={project} interactive />
  </Link>
}

function ProjectCopy({ project, index }) {
  return <div className="story-copy" data-reveal-group>
    <p className="story-type mono" data-reveal><span data-index={index}>0{index}</span>{project.type}</p>
    <h3 id={project.slug + '-title'} data-reveal>{project.name}</h3>
    <p data-reveal>{project.summary}</p>
    <Stack items={project.stack} />
    <div className="project-actions" data-reveal>
      <Action className="primary" to={'/work/' + project.slug}>View case study</Action>
      <Action href={project.url}>Live website</Action>
    </div>
  </div>
}

function CommerceStory({ project }) {
  const [view, setView] = useState('desktop')
  return <article className="project-story commerce-story" aria-labelledby="buynest-title">
    <ProjectCopy project={project} index={1} />
    <div className="commerce-visual" data-parallax>
      <div className="commerce-viewport" data-device={view}>
        <ScreenshotLink project={project} />
        {view === 'product' && <a className="commerce-product" href={project.url + 'product/1'}>
          <img src={buyNestMedia.product} srcSet={buyNestMedia.productSrcSet} sizes="(max-width: 790px) 80vw, 66vw" width="1320" height="780" alt="Open the featured product page in the live BuyNest storefront"
            loading="lazy" decoding="async" />
        </a>}
        <figure className="commerce-phone"><img src={buyNestMedia.mobile} width="390" height="780"
          alt="BuyNest storefront running on a mobile viewport" loading="lazy" decoding="async" /></figure>
      </div>
      <div className="story-control" role="group" aria-label="BuyNest screenshot focus">
        <button type="button" aria-pressed={view === 'desktop'} onClick={() => setView('desktop')}><ShoppingBag size={15} /> Desktop storefront</button>
        <button type="button" aria-pressed={view === 'mobile'} onClick={() => setView('mobile')}><Smartphone size={15} /> Mobile storefront</button>
        <button type="button" aria-pressed={view === 'product'} onClick={() => setView('product')}>Product details</button>
        <a href={project.url}>Try the storefront <ArrowUpRight size={14} /></a>
      </div>
    </div>
  </article>
}

const samples = [
  ['Revenue', [23, 39, 36, 53, 48, 71, 64]],
  ['Tasks', [26, 42, 57, 40, 69, 62, 78]],
]

function DashboardStory({ project }) {
  const [series, setSeries] = useState(0)
  return <article className="project-story dashboard-story" aria-labelledby="tasksphere-title">
    <ProjectCopy project={project} index={2} />
    <div className="dashboard-visual" data-parallax>
      <ScreenshotLink project={project} />
      <div className="chart-demo">
        <p className="mono"><Activity size={13} /> Interactive chart · Sample data</p>
        <div className="chart-picker" role="group" aria-label="Choose a sample metric">
          {samples.map(([name], index) => <button key={name} type="button" aria-pressed={series === index}
            onClick={() => setSeries(index)}>{name}</button>)}
        </div>
        <ol className="chart-bars" aria-label={samples[series][0] + ' sample values'}>
          {samples[series][1].map((value, index) => <li key={index} style={{ '--value': value + '%' }}>
            <span className="sr-only">{value}</span>
          </li>)}
        </ol>
      </div>
    </div>
  </article>
}

function SocialStory({ project }) {
  const [focus, setFocus] = useState('feed')
  return <article className="project-story social-story" aria-labelledby="boca-en-boca-title">
    <div className="social-visual" data-focus={focus} data-parallax>
      <ScreenshotLink project={project} />
      <div className="feed-detail" aria-hidden="true"><ProjectImage project={project} sizes="(max-width: 790px) 70vw, 55vw" /></div>
    </div>
    <div className="social-notes">
      <ProjectCopy project={project} index={3} />
      <div className="story-control" role="group" aria-label="Boca En Boca screenshot focus">
        <button type="button" aria-pressed={focus === 'feed'} onClick={() => setFocus('feed')}>Full feed</button>
        <button type="button" aria-pressed={focus === 'listing'} onClick={() => setFocus('listing')}>Listing detail</button>
      </div>
    </div>
  </article>
}

export default function Work() {
  return <section id="work" tabIndex={-1} className="work section">
    <div className="shell section-heading" data-reveal-group>
      <SectionLabel index="01">Portfolio</SectionLabel>
      <h2 data-reveal>Selected <em>work.</em></h2>
      <p data-reveal>Three builds across commerce, analytics, and social hiring.</p>
    </div>
    <div className="project-list shell">
      <CommerceStory project={projects[0]} />
      <DashboardStory project={projects[1]} />
      <SocialStory project={projects[2]} />
    </div>
  </section>
}
