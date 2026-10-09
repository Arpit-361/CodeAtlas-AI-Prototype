import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { PrototypeBanner } from '../components/common/PrototypeBanner'
import { useProject } from '../context/ProjectContext'
import { ANALYSIS_STAGES } from '../data'
import type { AnalysisStageStatus } from '../types'

interface AnalysisLocationState {
  source?: 'github-url' | 'zip-upload' | 'sample'
  label?: string
  simulated?: boolean
}

export function AnalysisProgressPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { completeSimulatedImport, setAnalyzing } = useProject()
  const state = (location.state ?? {}) as AnalysisLocationState

  const [stageIndex, setStageIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const source = state.source ?? 'sample'
  const label = state.label ?? 'TaskFlow API sample'

  const statuses = useMemo(() => {
    return ANALYSIS_STAGES.map((_, i) => {
      if (error) {
        if (i < stageIndex) return 'complete' as AnalysisStageStatus
        if (i === stageIndex) return 'error' as AnalysisStageStatus
        return 'pending' as AnalysisStageStatus
      }
      if (done || i < stageIndex) return 'complete' as AnalysisStageStatus
      if (i === stageIndex) return 'running' as AnalysisStageStatus
      return 'pending' as AnalysisStageStatus
    })
  }, [stageIndex, done, error])

  useEffect(() => {
    if (!state.source && !state.label) {
      // Allow direct navigation — still run simulation against sample
    }
    setAnalyzing(true)
  }, [state.source, state.label, setAnalyzing])

  useEffect(() => {
    if (done || error) return

    const stage = ANALYSIS_STAGES[stageIndex]
    if (!stage) return

    const timer = window.setTimeout(() => {
      if (stageIndex >= ANALYSIS_STAGES.length - 1) {
        setDone(true)
        completeSimulatedImport({
          source,
          label,
          at: new Date().toISOString(),
        })
        return
      }
      setStageIndex((i) => i + 1)
    }, stage.durationMs)

    return () => window.clearTimeout(timer)
  }, [stageIndex, done, error, completeSimulatedImport, source, label])

  const progress = done
    ? 100
    : Math.round(((stageIndex + (done ? 1 : 0.45)) / ANALYSIS_STAGES.length) * 100)

  return (
    <div className="mx-auto max-w-xl space-y-5 p-4 sm:p-6 fade-in">
      <div>
        <h2 className="text-xl font-semibold text-ink">Analysis progress</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Running staged simulation for{' '}
          <span className="font-medium text-ink">{label}</span>
        </p>
      </div>

      <PrototypeBanner message="Stages below are a timed UI simulation. No repository structure, files, or dependencies were actually extracted." />

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">
            {done ? 'Simulation complete' : `Step ${stageIndex + 1} of ${ANALYSIS_STAGES.length}`}
          </p>
          <p className="text-sm font-medium tabular-nums text-accent">{progress}%</p>
        </div>
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-surface-elevated">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-violet transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="space-y-3">
          {ANALYSIS_STAGES.map((stage, i) => {
            const status = statuses[i]
            return (
              <li
                key={stage.id}
                className={`flex gap-3 rounded-lg border px-3 py-3 transition ${
                  status === 'running'
                    ? 'border-accent/30 bg-accent/5'
                    : status === 'complete'
                      ? 'border-border bg-surface-elevated/50'
                      : status === 'error'
                        ? 'border-danger/30 bg-danger/5'
                        : 'border-transparent'
                }`}
              >
                <StatusIcon status={status} />
                <div>
                  <p className="text-sm font-medium text-ink">{stage.label}</p>
                  <p className="text-xs text-ink-muted">{stage.description}</p>
                </div>
              </li>
            )
          })}
        </ol>

        {error && (
          <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
            <div className="mt-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setError(null)
                  setStageIndex(0)
                  setDone(false)
                }}
              >
                Retry simulation
              </Button>
            </div>
          </div>
        )}

        {done && (
          <div className="mt-5 flex flex-wrap gap-2 slide-up">
            <Button onClick={() => navigate('/architecture')}>
              Open architecture explorer
            </Button>
            <Button variant="secondary" onClick={() => navigate('/project')}>
              View project details
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

function StatusIcon({ status }: { status: AnalysisStageStatus }) {
  if (status === 'complete') {
    return <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
  }
  if (status === 'running') {
    return <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-accent" />
  }
  if (status === 'error') {
    return <Circle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
  }
  return <Circle className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
}
