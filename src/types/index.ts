export type ComponentType =
  | 'module'
  | 'file'
  | 'class'
  | 'function'
  | 'service'
  | 'route'
  | 'model'
  | 'util'
  | 'database'

export type ComponentStatus = 'stable' | 'experimental' | 'deprecated' | 'critical'

export type AnalysisStageId =
  | 'structure'
  | 'discovery'
  | 'dependencies'
  | 'architecture'
  | 'visualization'

export type AnalysisStageStatus = 'pending' | 'running' | 'complete' | 'error'

export interface ProjectMetrics {
  files: number
  components: number
  dependencies: number
  modules: number
  linesOfCode: number
  avgComplexity: number
  couplingScore: number
  coverageEstimate: number
}

export interface ProjectSummary {
  id: string
  name: string
  language: string
  framework: string
  source: 'sample' | 'github-url' | 'zip-upload'
  sourceLabel: string
  description: string
  lastAnalyzed: string
  status: 'ready' | 'analyzing' | 'error'
  metrics: ProjectMetrics
}

export interface ArchitectureNode {
  id: string
  name: string
  type: ComponentType
  path: string
  description: string
  status: ComponentStatus
  linesOfCode?: number
  complexity?: number
}

export interface ArchitectureEdge {
  id: string
  source: string
  target: string
  relation: 'imports' | 'calls' | 'extends' | 'uses' | 'depends'
}

export interface ComponentRecord extends ArchitectureNode {
  dependencyCount: number
  dependentCount: number
  dependencies: string[]
  dependents: string[]
}

export interface DependencyRecord {
  id: string
  fromId: string
  toId: string
  fromName: string
  toName: string
  fromPath: string
  toPath: string
  relation: ArchitectureEdge['relation']
  fromType: ComponentType
  toType: ComponentType
}

export interface DashboardStats {
  totalProjects: number
  totalFiles: number
  totalComponents: number
  totalDependencies: number
}

export interface RecentProject {
  id: string
  name: string
  language: string
  lastOpened: string
  status: ProjectSummary['status']
}

export interface AnalysisStage {
  id: AnalysisStageId
  label: string
  description: string
  durationMs: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface SuggestedPrompt {
  id: string
  label: string
  prompt: string
}
