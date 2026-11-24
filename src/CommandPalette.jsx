import { playgroundPath, workPath } from './routePaths'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowDown, ArrowUpRight, CornerDownLeft, Search } from 'lucide-react'
import { profile, projects } from './data'

const commands = [
  ['Selected work', 'Section', '/#work'], ['About', 'Section', '/#about'],
  ['Toolkit', 'Section', '/#toolkit'], ['Professional journey', 'Section', '/#experience'],
  ['Contact', 'Section', '/#contact'], ['Developer Playground', 'Playground', playgroundPath],
  ...projects.map(({ name, slug }) => [name + ' case study', 'Project', workPath(slug)]),
  ['Download résumé', 'Download', profile.resume],
  ['Copy email address', 'Clipboard', profile.email],
  ['GitHub', 'External', profile.github], ['LinkedIn', 'External', profile.linkedin],
]

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate()
  const dialog = useRef(null)
  const search = useRef(null)
  const restore = useRef(null)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState('')
  const words = query.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().split(/\s+/)
  const results = commands.filter(command => {
    const label = command.join(' ').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
    return words.every(word => label.includes(word))
  })

  useEffect(() => {
    const element = dialog.current
    if (open && !element.open) {
      restore.current = document.activeElement
      element.showModal()
      search.current.focus()
    } else if (!open && element.open) {
      element.close()
      const previous = restore.current
      if (previous?.getClientRects().length) previous.focus({ preventScroll: true })
      else document.querySelector('.command-trigger')?.focus({ preventScroll: true })
    }
  }, [open])

  function close() {
    setQuery('')
    setIndex(0)
    onClose()
  }

  function move(step) {
    if (!results.length) return
    const next = (index + step + results.length) % results.length
    setIndex(next)
    document.getElementById('command-' + next)?.scrollIntoView({ block: 'nearest' })
  }

  async function execute(command) {
    if (!command) return
    const [, kind, target] = command
    close()
    if (kind === 'External') window.open(target, '_blank', 'noopener,noreferrer')
    else if (kind === 'Clipboard') {
      setStatus('')
      try {
        await navigator.clipboard.writeText(target)
        setStatus('Email address copied.')
      } catch {
        navigate('/#contact')
        setStatus('Select the email address to copy it.')
      }
    } else if (kind === 'Download') {
      const link = document.createElement('a')
      link.href = target
      link.download = ''
      document.body.append(link)
      link.click()
      link.remove()
    } else {
      dialog.current.close()
      navigate(target)
    }
  }

  return <>
    <p className="sr-only" role="status">{status}</p>
    <dialog ref={dialog} className="command-dialog" aria-label="Quick navigation" data-lenis-prevent
      onCancel={event => { event.preventDefault(); close() }}
      onClick={event => { if (event.target === event.currentTarget) close() }}>
      <div className="command-content">
        <div className="command-search">
          <Search size={20} aria-hidden="true" />
          <input ref={search} role="combobox" aria-label="Search commands" aria-controls="command-results"
            aria-expanded={open} aria-autocomplete="list" aria-activedescendant={results.length ? 'command-' + index : undefined}
            placeholder="Find a project or jump to a section…" value={query}
            onChange={event => { setQuery(event.target.value); setIndex(0) }}
            onKeyDown={event => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault()
                move(event.key === 'ArrowDown' ? 1 : -1)
              }
              if (event.key === 'Enter') { event.preventDefault(); execute(results[index]) }
            }} />
          <button type="button" aria-label="Close command palette" onClick={close}>Esc</button>
        </div>
        <ul id="command-results" className="command-results" role="listbox" aria-label="Commands">
          {results.map((command, position) => <li key={command[0]} role="option" id={'command-' + position}
            aria-selected={position === index} onPointerMove={() => setIndex(position)}
            onMouseDown={event => event.preventDefault()} onClick={() => execute(command)}>
            <span>{command[0]}</span><small>{command[1]}</small><ArrowUpRight size={15} aria-hidden="true" />
          </li>)}
        </ul>
        {!results.length && <p className="command-empty" role="status">No matching commands.</p>}
        <div className="command-hints mono"><span><ArrowDown size={12} /> Navigate</span><span><CornerDownLeft size={12} /> Select</span></div>
      </div>
    </dialog>
  </>
}
