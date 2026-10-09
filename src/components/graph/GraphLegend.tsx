import { NODE_COLORS, TYPE_LABELS } from '../../utilities/graph'
import type { ComponentType } from '../../types'

const ORDER: ComponentType[] = [
  'module',
  'service',
  'route',
  'class',
  'model',
  'function',
  'util',
  'database',
  'file',
]

export function GraphLegend() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
      {ORDER.map((type) => (
        <div key={type} className="flex items-center gap-1.5 text-[11px] text-ink-muted">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: NODE_COLORS[type] }}
          />
          {TYPE_LABELS[type]}
        </div>
      ))}
    </div>
  )
}
