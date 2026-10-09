import { useCallback, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Core } from 'cytoscape'
import { Network } from 'lucide-react'
import { ArchitectureGraph } from '../components/graph/ArchitectureGraph'
import { GraphLegend } from '../components/graph/GraphLegend'
import { GraphToolbar } from '../components/graph/GraphToolbar'
import { NodeDetailsPanel } from '../components/graph/NodeDetailsPanel'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { PrototypeBanner } from '../components/common/PrototypeBanner'
import { useProject } from '../context/ProjectContext'
import type { ComponentType } from '../types'
import { runLayout } from '../utilities/graph'

const ALL_TYPES: ComponentType[] = [
  'module',
  'service',
  'route',
  'class',
  'function',
  'database',
  'file',
  'model',
  'util',
]

export function ArchitecturePage() {
  const { hasProject } = useProject()
  const cyRef = useRef<Core | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [activeTypes, setActiveTypes] = useState<Set<ComponentType>>(
    () => new Set(ALL_TYPES),
  )

  const onSelect = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  const onToggleType = useCallback((type: ComponentType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        if (next.size > 1) next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }, [])

  const typeFilter = useMemo(() => activeTypes, [activeTypes])

  if (!hasProject) {
    return (
      <EmptyState
        icon={Network}
        title="No project loaded"
        description="Import a repository or open the sample TaskFlow project to explore the architecture graph."
        action={
          <Link to="/import">
            <Button>Import repository</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col fade-in">
      <div className="border-b border-border-subtle px-4 py-3">
        <PrototypeBanner className="mb-0" message="Graph nodes and edges are from the TaskFlow sample mock dataset — not computed from your URL or ZIP." />
      </div>

      <GraphToolbar
        query={query}
        onQueryChange={setQuery}
        activeTypes={activeTypes}
        onToggleType={onToggleType}
        onZoomIn={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.2)}
        onZoomOut={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)}
        onFit={() => cyRef.current?.fit(undefined, 36)}
        onReset={() => {
          setQuery('')
          setActiveTypes(new Set(ALL_TYPES))
          setSelectedId(null)
          if (cyRef.current) runLayout(cyRef.current)
        }}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative min-h-[420px] flex-1">
          <ArchitectureGraph
            selectedId={selectedId}
            onSelect={onSelect}
            query={query}
            activeTypes={typeFilter}
            cyRef={cyRef}
          />
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-lg border border-border/80 bg-surface/90 p-2 backdrop-blur lg:right-auto lg:max-w-md">
            <GraphLegend />
          </div>
        </div>
        <div className="h-72 shrink-0 lg:h-auto lg:w-80 xl:w-96">
          <NodeDetailsPanel
            nodeId={selectedId}
            onClose={() => setSelectedId(null)}
            onSelectRelated={setSelectedId}
          />
        </div>
      </div>
    </div>
  )
}
