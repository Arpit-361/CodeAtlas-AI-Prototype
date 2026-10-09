import { X } from 'lucide-react'
import { Badge } from '../common/Badge'
import { ComponentStatusBadge } from '../common/StatusBadge'
import { getComponentById, getNodeById } from '../../data'
import { TYPE_LABELS } from '../../utilities/graph'
import type { ComponentType } from '../../types'

interface NodeDetailsPanelProps {
  nodeId: string | null
  onClose: () => void
  onSelectRelated: (id: string) => void
}

export function NodeDetailsPanel({
  nodeId,
  onClose,
  onSelectRelated,
}: NodeDetailsPanelProps) {
  if (!nodeId) {
    return (
      <aside className="flex h-full flex-col border-l border-border bg-surface p-4">
        <h3 className="text-sm font-semibold text-ink">Details</h3>
        <p className="mt-3 text-sm text-ink-muted">
          Select a node in the graph to inspect its path, type, dependencies,
          and dependents.
        </p>
      </aside>
    )
  }

  const component = getComponentById(nodeId)
  if (!component) {
    return (
      <aside className="border-l border-border bg-surface p-4">
        <p className="text-sm text-danger">Node not found in mock data.</p>
      </aside>
    )
  }

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-l border-border bg-surface">
      <div className="flex items-start justify-between gap-2 border-b border-border-subtle p-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-ink">
            {component.name}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
            {component.path}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-ink-faint hover:bg-surface-hover hover:text-ink"
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="accent">
            {TYPE_LABELS[component.type as ComponentType]}
          </Badge>
          <ComponentStatusBadge status={component.status} />
        </div>

        <p className="text-sm leading-relaxed text-ink-muted">
          {component.description}
        </p>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-ink-faint">Dependencies</dt>
            <dd className="font-semibold tabular-nums text-ink">
              {component.dependencyCount}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Dependents</dt>
            <dd className="font-semibold tabular-nums text-ink">
              {component.dependentCount}
            </dd>
          </div>
          {component.linesOfCode != null && (
            <div>
              <dt className="text-xs text-ink-faint">Lines of code</dt>
              <dd className="font-semibold tabular-nums text-ink">
                {component.linesOfCode}
              </dd>
            </div>
          )}
          {component.complexity != null && (
            <div>
              <dt className="text-xs text-ink-faint">Complexity</dt>
              <dd className="font-semibold tabular-nums text-ink">
                {component.complexity}
              </dd>
            </div>
          )}
        </dl>

        <RelatedList
          title="Depends on"
          ids={component.dependencies}
          onSelect={onSelectRelated}
        />
        <RelatedList
          title="Used by"
          ids={component.dependents}
          onSelect={onSelectRelated}
        />
      </div>
    </aside>
  )
}

function RelatedList({
  title,
  ids,
  onSelect,
}: {
  title: string
  ids: string[]
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-faint">
        {title} ({ids.length})
      </h4>
      {ids.length === 0 ? (
        <p className="text-xs text-ink-faint">None in sample graph</p>
      ) : (
        <ul className="space-y-1">
          {ids.map((id) => {
            const node = getNodeById(id)
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  className="w-full rounded-md border border-border bg-surface-elevated px-2.5 py-1.5 text-left text-xs text-ink hover:border-accent/30 hover:bg-surface-hover"
                >
                  <span className="font-medium">{node?.name ?? id}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-ink-faint">
                    {node?.path}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
