import { Link } from 'react-router'
import { Action, Preview, SectionLabel, Stack } from './components'
import { archivedProjects, featuredProjects } from './data'
import { workPath } from './routePaths'

function FeaturedStory({ project, index }) {
  const title = project.slug + '-title'
  return <article className={'project-story featured-story featured-' + project.theme} aria-labelledby={title}>
    <div className="story-copy" data-reveal-group>
      <p className="story-type mono" data-reveal><span>{String(index + 1).padStart(2, '0')}</span>{project.category}</p>
      <h3 id={title} data-reveal>{project.name}</h3>
      <p className="story-subtitle" data-reveal>{project.type}</p>
      <p data-reveal>{project.summary}</p>
      <Stack items={project.stack} />
      <div className="project-actions" data-reveal>
        <Action className="primary" to={workPath(project.slug)} ariaLabel={'View ' + project.name + ' case study'}>View case study</Action>
        <Action href={project.url} newTab ariaLabel={'Open ' + project.name + ' live website in a new tab'}>Live website</Action>
        <Action href={project.source} newTab ariaLabel={'Open ' + project.name + ' source code on GitHub in a new tab'}>GitHub source</Action>
      </div>
    </div>
    {project.capture && <Link className="project-preview-link" to={workPath(project.slug)} aria-label={'Open ' + project.name + ' case study'}>
      <Preview project={project} interactive />
    </Link>}
  </article>
}

export default function Work() {
  return <section id="work" tabIndex={-1} className="work section">
    <div className="shell section-heading" data-reveal-group>
      <SectionLabel index="01">Latest projects</SectionLabel>
      <h2 data-reveal>Selected <em>work.</em></h2>
    </div>
    <div className="project-list shell" aria-label="Featured projects">
      {featuredProjects.map((project, index) => <FeaturedStory key={project.slug} project={project} index={index} />)}
    </div>
    <section className="project-archive shell" id="project-archive" tabIndex={-1} aria-labelledby="archive-title">
      <h3 id="archive-title">Project archive</h3>
      <ul>
        {archivedProjects.map(project => <li key={project.slug}>
          <div><h4>{project.name}</h4><p>{project.type}</p></div>
          <Action to={workPath(project.slug)} ariaLabel={'View ' + project.name + ' case study'}>View case study</Action>
        </li>)}
      </ul>
    </section>
  </section>
}
