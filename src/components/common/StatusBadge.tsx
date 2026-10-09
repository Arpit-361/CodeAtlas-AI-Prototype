import type { ComponentStatus, ProjectSummary } from '../../types'
import { Badge } from './Badge'

const componentTone: Record<
  ComponentStatus,
  'success' | 'warning' | 'danger' | 'violet'
> = {
  stable: 'success',
  experimental: 'violet',
  deprecated: 'warning',
  critical: 'danger',
}

export function ComponentStatusBadge({ status }: { status: ComponentStatus }) {
  return <Badge tone={componentTone[status]}>{status}</Badge>
}

export function ProjectStatusBadge({
  status,
}: {
  status: ProjectSummary['status']
}) {
  const tone =
    status === 'ready' ? 'success' : status === 'analyzing' ? 'accent' : 'danger'
  return <Badge tone={tone}>{status}</Badge>
}
