import { FlaskConical } from 'lucide-react'

interface PrototypeBannerProps {
  message?: string
  className?: string
}

export function PrototypeBanner({
  message = 'Prototype mode — all analysis and AI answers use simulated sample data. No repository was fetched or parsed.',
  className = '',
}: PrototypeBannerProps) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border border-accent/20 bg-accent/10 px-3 py-2.5 text-xs text-ink-muted ${className}`}
      role="status"
    >
      <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
      <p>{message}</p>
    </div>
  )
}
