import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center fade-in">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-elevated text-ink-muted">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      </div>
      {action}
    </div>
  )
}
