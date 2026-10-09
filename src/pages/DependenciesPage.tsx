import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { PrototypeBanner } from '../components/common/PrototypeBanner'
import { SearchInput } from '../components/common/SearchInput'
import { useProject } from '../context/ProjectContext'
import { DEPENDENCY_RECORDS, getComponentById } from '../data'
import { TYPE_LABELS } from '../utilities/graph'
import { capitalize } from '../utilities/format'

export function DependenciesPage() {
  const { hasProject } = useProject()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return DEPENDENCY_RECORDS
    return DEPENDENCY_RECORDS.filter(
      (d) =>
        d.fromName.toLowerCase().includes(q) ||
        d.toName.toLowerCase().includes(q) ||
        d.fromPath.toLowerCase().includes(q) ||
        d.toPath.toLowerCase().includes(q) ||
        d.relation.includes(q),
    )
  }, [query])

  const selected = selectedId
    ? DEPENDENCY_RECORDS.find((d) => d.id === selectedId)
    : null

  if (!hasProject) {
    return (
      <EmptyState
        icon={GitBranch}
        title="No dependencies to show"
        description="Load a project to browse the simulated dependency list."
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
          <h2 className="text-lg font-semibold text-ink">Dependencies</h2>
          <p className="text-sm text-ink-muted">
            {filtered.length} of {DEPENDENCY_RECORDS.length} edges in sample graph
          </p>
        </div>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search dependencies…"
          className="w-full sm:w-72"
        />
      </div>

      <PrototypeBanner />

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <Card padding="none" className="overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto lg:max-h-[calc(100vh-240px)]">
            {filtered.length === 0 ? (
              <EmptyState
                icon={GitBranch}
                title="No matches"
                description="Try a different search term."
              />
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-border bg-surface-elevated text-xs uppercase tracking-wider text-ink-faint">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">From</th>
                    <th className="px-4 py-2.5 font-medium">Relation</th>
                    <th className="px-4 py-2.5 font-medium">To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filtered.map((dep) => (
                    <tr
                      key={dep.id}
                      onClick={() => setSelectedId(dep.id)}
                      className={`cursor-pointer transition hover:bg-surface-hover/60 ${
                        selectedId === dep.id ? 'bg-accent/10' : ''
                      }`}
                    >
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-ink">{dep.fromName}</p>
                        <p className="truncate text-[11px] text-ink-faint">
                          {dep.fromPath}
                        </p>
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge>{capitalize(dep.relation)}</Badge>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-ink">{dep.toName}</p>
                        <p className="truncate text-[11px] text-ink-faint">
                          {dep.toPath}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-ink">Edge details</h3>
          {!selected ? (
            <p className="mt-3 text-sm text-ink-muted">
              Select a dependency row to inspect endpoints and types.
            </p>
          ) : (
            <div className="mt-4 space-y-4 slide-up">
              <div>
                <p className="text-xs text-ink-faint">From</p>
                <p className="font-medium text-ink">{selected.fromName}</p>
                <p className="font-mono text-[11px] text-ink-faint">
                  {selected.fromPath}
                </p>
                <Badge tone="accent" className="mt-1">
                  {TYPE_LABELS[selected.fromType]}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Relation</p>
                <p className="font-medium text-ink">
                  {capitalize(selected.relation)}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">To</p>
                <p className="font-medium text-ink">{selected.toName}</p>
                <p className="font-mono text-[11px] text-ink-faint">
                  {selected.toPath}
                </p>
                <Badge tone="violet" className="mt-1">
                  {TYPE_LABELS[selected.toType]}
                </Badge>
              </div>
              <div className="rounded-lg border border-border bg-surface-elevated p-3 text-xs text-ink-muted">
                <p>
                  From node dependents:{' '}
                  <span className="font-medium text-ink">
                    {getComponentById(selected.fromId)?.dependentCount ?? 0}
                  </span>
                </p>
                <p className="mt-1">
                  To node dependents:{' '}
                  <span className="font-medium text-ink">
                    {getComponentById(selected.toId)?.dependentCount ?? 0}
                  </span>
                </p>
              </div>
              <Link
                to="/architecture"
                className="inline-flex text-sm text-accent hover:underline"
              >
                View in architecture graph →
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
