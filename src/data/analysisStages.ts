import type { AnalysisStage } from '../types'

export const ANALYSIS_STAGES: AnalysisStage[] = [
  {
    id: 'structure',
    label: 'Structure scan',
    description: 'Walking the repository tree and identifying top-level packages.',
    durationMs: 900,
  },
  {
    id: 'discovery',
    label: 'File discovery',
    description: 'Cataloging source files, configs, and test suites.',
    durationMs: 1100,
  },
  {
    id: 'dependencies',
    label: 'Dependency extraction',
    description: 'Resolving import graphs and call relationships (simulated).',
    durationMs: 1400,
  },
  {
    id: 'architecture',
    label: 'Architecture model',
    description: 'Grouping modules into services, models, routes, and utilities.',
    durationMs: 1200,
  },
  {
    id: 'visualization',
    label: 'Visualization prep',
    description: 'Building the interactive graph layout and detail indexes.',
    durationMs: 800,
  },
]
