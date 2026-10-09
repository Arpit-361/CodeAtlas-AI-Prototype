import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Boxes } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { PrototypeBanner } from '../components/common/PrototypeBanner'
import { SearchInput } from '../components/common/SearchInput'
import { ComponentStatusBadge } from '../components/common/StatusBadge'
import { useProject } from '../context/ProjectContext'
import { COMPONENT_RECORDS } from '../data'
import type { ComponentStatus, ComponentType } from '../types'
import { TYPE_LABELS } from '../utilities/graph'

const TYPE_FILTERS: Array<ComponentType | 'all'> = [
  'all',
  'module',
  'service',
  'route',
  'class',
  'function',
  'database',
  'file',
]

export function ComponentsPage() {
  const { hasProject } = useProject()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<ComponentType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ComponentStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COMPONENT_RECORDS.filter((c) => {
      if (typeFilter !== 'all' && c.type !== typeFilter) return false
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.path.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      )
    })
  }, [query, typeFilter, statusFilter])

  const selected = selectedId
    ? COMPONENT_RECORDS.find((c) => c.id === selectedId)
    : null

  if (!hasProject) {
    return (
      <EmptyState
        icon={Boxes}
        title="No components loaded"
        description="Open a project to browse the component catalog."
        action={
          <Link to="/import">
            <Button>Import repository</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 p-4 sm:p-6 fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Components</h2>
          <p className="text-sm text-ink-muted">
            {filtered.length} of {COMPONENT_RECORDS.length} in catalog
          </p>
        </div>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search components…"
          className="w-full sm:w-72"
        />
      </div>

      <PrototypeBanner />

      <div className="flex flex-wrap gap-1.5">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(t)}
            className={`rounded-md border px-2.5 py-1 text-xs transition ${
              typeFilter === t
                ? 'border-accent/40 bg-accent/15 text-ink'
                : 'border-border bg-surface text-ink-muted hover:text-ink'
            }`}
          >
            {t === 'all' ? 'All types' : TYPE_LABELS[t]}
          </button>
        ))}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ComponentStatus | 'all')
          }
          className="ml-auto h-8 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink outline-none"
        >
          <option value="all">All statuses</option>
          <option value="stable">Stable</option>
          <option value="experimental">Experimental</option>
          <option value="deprecated">Deprecated</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.5fr_0.9fr]">
        <Card padding="none" className="overflow-hidden">
          <div className="max-h-[55vh] overflow-x-auto overflow-y-auto lg:max-h-[calc(100vh-280px)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-border bg-surface-elevated text-xs uppercase tracking-wider text-ink-faint">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Path</th>
                  <th className="px-4 py-2.5 font-medium">Deps</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`cursor-pointer hover:bg-surface-hover/60 ${
                      selectedId === c.id ? 'bg-accent/10' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 font-medium text-ink">
                      {c.name}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge tone="neutral">{TYPE_LABELS[c.type]}</Badge>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-2.5 font-mono text-[11px] text-ink-faint">
                      {c.path}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-ink-muted">
                      {c.dependencyCount}
                    </td>
                    <td className="px-4 py-2.5">
                      <ComponentStatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <EmptyState
                icon={Boxes}
                title="No components match"
                description="Adjust filters or clear the search."
              />
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-ink">Component details</h3>
          {!selected ? (
            <p className="mt-3 text-sm text-ink-muted">
              Select a row to view description and dependency counts.
            </p>
          ) : (
            <div className="mt-4 space-y-3 slide-up">
              <div>
                <p className="text-base font-semibold text-ink">
                  {selected.name}
                </p>
                <p className="font-mono text-[11px] text-ink-faint">
                  {selected.path}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge tone="accent">{TYPE_LABELS[selected.type]}</Badge>
                <ComponentStatusBadge status={selected.status} />
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">
                {selected.description}
              </p>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-ink-faint">Dependencies</dt>
                  <dd className="font-semibold text-ink">
                    {selected.dependencyCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Dependents</dt>
                  <dd className="font-semibold text-ink">
                    {selected.dependentCount}
                  </dd>
                </div>
              </dl>
              <Link
                to="/architecture"
                className="inline-flex text-sm text-accent hover:underline"
              >
                Highlight in graph →
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
