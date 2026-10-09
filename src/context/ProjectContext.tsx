import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SAMPLE_PROJECT } from '../data'
import type { ProjectSummary } from '../types'
import {
  loadActiveProjectId,
  saveActiveProjectId,
  saveLastImport,
  type StoredImportMeta,
} from '../utilities/storage'

interface ProjectContextValue {
  project: ProjectSummary | null
  hasProject: boolean
  isAnalyzing: boolean
  setAnalyzing: (value: boolean) => void
  openSampleProject: () => void
  completeSimulatedImport: (meta: StoredImportMeta) => void
  clearProject: () => void
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

function initialProject(): ProjectSummary | null {
  const id = loadActiveProjectId()
  if (id === SAMPLE_PROJECT.id) return SAMPLE_PROJECT
  if (id) return SAMPLE_PROJECT
  return null
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<ProjectSummary | null>(initialProject)
  const [isAnalyzing, setAnalyzing] = useState(false)

  const openSampleProject = useCallback(() => {
    setProject(SAMPLE_PROJECT)
    saveActiveProjectId(SAMPLE_PROJECT.id)
    saveLastImport({
      source: 'sample',
      label: 'TaskFlow API sample',
      at: new Date().toISOString(),
    })
  }, [])

  const completeSimulatedImport = useCallback((meta: StoredImportMeta) => {
    const next: ProjectSummary = {
      ...SAMPLE_PROJECT,
      source: meta.source === 'sample' ? 'sample' : meta.source,
      sourceLabel:
        meta.source === 'github-url'
          ? `Simulated from URL: ${meta.label} (prototype data — not fetched)`
          : meta.source === 'zip-upload'
            ? `Simulated from ZIP: ${meta.label} (prototype data — not parsed)`
            : SAMPLE_PROJECT.sourceLabel,
      lastAnalyzed: new Date().toISOString(),
      status: 'ready',
    }
    setProject(next)
    saveActiveProjectId(next.id)
    saveLastImport(meta)
    setAnalyzing(false)
  }, [])

  const clearProject = useCallback(() => {
    setProject(null)
    saveActiveProjectId('')
  }, [])

  const value = useMemo(
    () => ({
      project,
      hasProject: project !== null,
      isAnalyzing,
      setAnalyzing,
      openSampleProject,
      completeSimulatedImport,
      clearProject,
    }),
    [
      project,
      isAnalyzing,
      openSampleProject,
      completeSimulatedImport,
      clearProject,
    ],
  )

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  )
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext)
  if (!ctx) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return ctx
}
