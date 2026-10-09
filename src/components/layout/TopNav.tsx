import { Menu, Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useProject } from '../../context/ProjectContext'
import { Badge } from '../common/Badge'

const titles: Record<string, string> = {
  '/': 'Overview',
  '/import': 'Import repository',
  '/analysis': 'Analysis progress',
  '/architecture': 'Architecture explorer',
  '/dependencies': 'Dependencies',
  '/components': 'Components',
  '/assistant': 'AI assistant',
  '/project': 'Project details',
}

interface TopNavProps {
  onOpenMobileNav: () => void
}

export function TopNav({ onOpenMobileNav }: TopNavProps) {
  const location = useLocation()
  const { project, hasProject } = useProject()
  const title = titles[location.pathname] ?? 'CodeAtlas AI'

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md">
      <button
        type="button"
        className="rounded-md p-2 text-ink-muted hover:bg-surface-hover hover:text-ink lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold text-ink sm:text-base">
          {title}
        </h1>
        {hasProject && project && (
          <p className="truncate text-xs text-ink-faint">
            {project.name} · {project.language} / {project.framework}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge tone="accent" className="hidden sm:inline-flex">
          Simulated data
        </Badge>
        {!hasProject ? (
          <Link
            to="/import"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3 text-xs font-medium text-canvas hover:brightness-110"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Import
          </Link>
        ) : (
          <Link
            to="/architecture"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 text-xs font-medium text-ink hover:bg-surface-hover"
          >
            Open graph
          </Link>
        )}
      </div>
    </header>
  )
}
