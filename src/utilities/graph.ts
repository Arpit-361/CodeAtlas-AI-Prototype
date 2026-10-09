import type { Core, ElementDefinition, StylesheetStyle } from 'cytoscape'
import type { ArchitectureEdge, ArchitectureNode, ComponentType } from '../types'

export const NODE_COLORS: Record<ComponentType, string> = {
  module: '#6b8aff',
  file: '#94a3b8',
  class: '#a78bfa',
  function: '#34d399',
  service: '#38bdf8',
  route: '#fbbf24',
  model: '#f472b6',
  util: '#2dd4bf',
  database: '#fb7185',
}

export const TYPE_LABELS: Record<ComponentType, string> = {
  module: 'Module',
  file: 'File',
  class: 'Class',
  function: 'Function',
  service: 'Service',
  route: 'Route',
  model: 'Model',
  util: 'Util',
  database: 'Database',
}

export function toCytoscapeElements(
  nodes: ArchitectureNode[],
  edges: ArchitectureEdge[],
): ElementDefinition[] {
  const nodeEls: ElementDefinition[] = nodes.map((node) => ({
    group: 'nodes',
    data: {
      id: node.id,
      label: node.name,
      type: node.type,
      path: node.path,
    },
  }))

  const edgeEls: ElementDefinition[] = edges.map((edge) => ({
    group: 'edges',
    data: {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      relation: edge.relation,
    },
  }))

  return [...nodeEls, ...edgeEls]
}

export function buildStylesheet(): StylesheetStyle[] {
  const typeStyles: StylesheetStyle[] = (
    Object.keys(NODE_COLORS) as ComponentType[]
  ).map((type) => ({
    selector: `node[type = "${type}"]`,
    style: {
      'background-color': NODE_COLORS[type],
      'border-color': NODE_COLORS[type],
    },
  }))

  return [
    {
      selector: 'node',
      style: {
        label: 'data(label)',
        color: '#e8edf5',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 6,
        'font-size': 10,
        'font-family': 'IBM Plex Sans, sans-serif',
        width: 28,
        height: 28,
        'border-width': 2,
        'background-opacity': 0.9,
        'overlay-padding': 4,
        'text-outline-color': '#0b0f14',
        'text-outline-width': 2,
      },
    },
    ...typeStyles,
    {
      selector: 'node[type = "module"]',
      style: {
        shape: 'round-rectangle',
        width: 42,
        height: 28,
      },
    },
    {
      selector: 'node[type = "database"]',
      style: {
        shape: 'barrel',
        width: 32,
        height: 32,
      },
    },
    {
      selector: 'node[type = "service"]',
      style: {
        shape: 'round-hexagon',
        width: 34,
        height: 34,
      },
    },
    {
      selector: 'edge',
      style: {
        width: 1.5,
        'line-color': '#2a3544',
        'target-arrow-color': '#2a3544',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'arrow-scale': 0.8,
        opacity: 0.75,
      },
    },
    {
      selector: 'node.dimmed',
      style: {
        opacity: 0.18,
      },
    },
    {
      selector: 'edge.dimmed',
      style: {
        opacity: 0.08,
      },
    },
    {
      selector: 'node.highlighted',
      style: {
        'border-width': 3,
        'border-color': '#e8edf5',
        'z-index': 999,
      },
    },
    {
      selector: 'node.neighbor',
      style: {
        opacity: 1,
        'border-width': 2.5,
        'border-color': '#93c5fd',
      },
    },
    {
      selector: 'edge.highlighted',
      style: {
        width: 2.5,
        'line-color': '#6b8aff',
        'target-arrow-color': '#6b8aff',
        opacity: 1,
        'z-index': 999,
      },
    },
    {
      selector: 'node.filtered-out',
      style: {
        display: 'none',
      },
    },
    {
      selector: 'edge.filtered-out',
      style: {
        display: 'none',
      },
    },
  ]
}

export function applySelectionHighlight(cy: Core, selectedId: string | null): void {
  cy.elements().removeClass('highlighted neighbor dimmed')

  if (!selectedId) return

  const selected = cy.getElementById(selectedId)
  if (!selected.nonempty()) return

  const neighborhood = selected.closedNeighborhood()
  cy.elements().difference(neighborhood).addClass('dimmed')
  selected.addClass('highlighted')
  selected.neighborhood('node').addClass('neighbor')
  selected.connectedEdges().addClass('highlighted')
}

export function applySearchFilter(
  cy: Core,
  query: string,
  allowedTypes: Set<ComponentType> | null,
): void {
  const q = query.trim().toLowerCase()

  cy.nodes().forEach((node) => {
    const label = String(node.data('label') ?? '').toLowerCase()
    const path = String(node.data('path') ?? '').toLowerCase()
    const type = node.data('type') as ComponentType
    const matchesQuery = !q || label.includes(q) || path.includes(q)
    const matchesType = !allowedTypes || allowedTypes.has(type)
    if (matchesQuery && matchesType) {
      node.removeClass('filtered-out')
    } else {
      node.addClass('filtered-out')
    }
  })

  cy.edges().forEach((edge) => {
    const srcHidden = edge.source().hasClass('filtered-out')
    const tgtHidden = edge.target().hasClass('filtered-out')
    if (srcHidden || tgtHidden) {
      edge.addClass('filtered-out')
    } else {
      edge.removeClass('filtered-out')
    }
  })
}

export function runLayout(cy: Core): void {
  cy.layout({
    name: 'cose',
    animate: true,
    animationDuration: 450,
    randomize: false,
    componentSpacing: 48,
    nodeRepulsion: () => 6500,
    idealEdgeLength: () => 90,
    nestingFactor: 1.2,
    gravity: 0.35,
    numIter: 800,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1,
    fit: true,
    padding: 36,
  }).run()
}
