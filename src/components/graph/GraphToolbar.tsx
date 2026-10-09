import {
  Focus,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Button } from '../common/Button'
import { SearchInput } from '../common/SearchInput'
import type { ComponentType } from '../../types'
import { TYPE_LABELS } from '../../utilities/graph'

const FILTER_TYPES: ComponentType[] = [
  'module',
  'service',
  'route',
  'class',
  'function',
  'database',
  'file',
]

interface GraphToolbarProps {
  query: string
  onQueryChange: (q: string) => void
  activeTypes: Set<ComponentType>
  onToggleType: (type: ComponentType) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onReset: () => void
}

export function GraphToolbar({
  query,
  onQueryChange,
  activeTypes,
  onToggleType,
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
}: GraphToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border-subtle bg-surface/90 p-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder="Search nodes by name or path…"
          className="min-w-[200px] flex-1"
        />
        <div className="flex items-center gap-1">
          <Button variant="secondary" size="sm" onClick={onZoomIn} aria-label="Zoom in" icon={<ZoomIn className="h-3.5 w-3.5" />}>
            <span className="sr-only">Zoom in</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={onZoomOut} aria-label="Zoom out" icon={<ZoomOut className="h-3.5 w-3.5" />}>
            <span className="sr-only">Zoom out</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={onFit} icon={<Maximize2 className="h-3.5 w-3.5" />}>
            Fit
          </Button>
          <Button variant="secondary" size="sm" onClick={onReset} icon={<RotateCcw className="h-3.5 w-3.5" />}>
            Reset
          </Button>
          <Button variant="ghost" size="sm" onClick={onFit} icon={<Focus className="h-3.5 w-3.5" />} className="hidden sm:inline-flex">
            Center
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {FILTER_TYPES.map((type) => {
          const active = activeTypes.has(type)
          return (
            <button
              key={type}
              type="button"
              onClick={() => onToggleType(type)}
              className={`rounded-md border px-2 py-1 text-[11px] font-medium transition ${
                active
                  ? 'border-accent/40 bg-accent/15 text-ink'
                  : 'border-border bg-surface-elevated text-ink-faint hover:text-ink-muted'
              }`}
            >
              {TYPE_LABELS[type]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
