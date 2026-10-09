import { useEffect, useRef } from 'react'
import cytoscape, { type Core } from 'cytoscape'
import { ARCHITECTURE_EDGES, ARCHITECTURE_NODES } from '../../data'
import type { ComponentType } from '../../types'
import {
  applySearchFilter,
  applySelectionHighlight,
  buildStylesheet,
  runLayout,
  toCytoscapeElements,
} from '../../utilities/graph'

interface ArchitectureGraphProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
  query: string
  activeTypes: Set<ComponentType>
  cyRef: React.MutableRefObject<Core | null>
}

export function ArchitectureGraph({
  selectedId,
  onSelect,
  query,
  activeTypes,
  cyRef,
}: ArchitectureGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const cy = cytoscape({
      container: containerRef.current,
      elements: toCytoscapeElements(ARCHITECTURE_NODES, ARCHITECTURE_EDGES),
      style: buildStylesheet(),
      minZoom: 0.35,
      maxZoom: 2.5,
      wheelSensitivity: 0.25,
      boxSelectionEnabled: false,
    })

    cyRef.current = cy
    runLayout(cy)

    cy.on('tap', 'node', (evt) => {
      onSelect(evt.target.id())
    })
    cy.on('tap', (evt) => {
      if (evt.target === cy) onSelect(null)
    })

    const onResize = () => {
      cy.resize()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cy.destroy()
      cyRef.current = null
    }
  }, [cyRef, onSelect])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    applySelectionHighlight(cy, selectedId)
  }, [selectedId, cyRef])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    applySearchFilter(cy, query, activeTypes)
  }, [query, activeTypes, cyRef])

  return <div ref={containerRef} className="cy-container" />
}
