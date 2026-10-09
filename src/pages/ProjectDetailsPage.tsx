import { Link } from 'react-router-dom'
import { FolderGit2 } from 'lucide-react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { PrototypeBanner } from '../components/common/PrototypeBanner'
import { ProjectStatusBadge } from '../components/common/StatusBadge'
import { useProject } from '../context/ProjectContext'
import { COMPONENT_RECORDS } from '../data'
import { formatDate, formatNumber } from '../utilities/format'
import { TYPE_LABELS } from '../utilities/graph'
import type { ComponentType } from '../types'

export function ProjectDetailsPage() {
  const { project, hasProject } = useProject()

  if (!hasProject || !project) {
    return (
      <EmptyState
        icon={FolderGit2}
        title="No project selected"
        description="Import or open the sample project to view analysis summary and metrics."
        action={
          <Link to="/import">
            <Button>Import repository</Button>
          </Link>
        }
      />
    )
  }

  const typeCounts = COMPONENT_RECORDS.reduce<Record<string, number>>(
    (acc, c) => {
      acc[c.type] = (acc[c.type] ?? 0) + 1
      return acc
    },
    {},
  )

  const pieData = Object.entries(typeCounts).map(([type, value]) => ({
    name: TYPE_LABELS[type as ComponentType] ?? type,
    value,
  }))

  const colors = [
    '#6b8aff',
    '#a78bfa',
    '#38bdf8',
    '#fbbf24',
    '#34d399',
    '#f472b6',
    '#2dd4bf',
    '#fb7185',
    '#94a3b8',
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6 fade-in">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-ink">{project.name}</h2>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="mt-1 text-sm text-ink-muted">{project.description}</p>
        </div>
        <Link to="/architecture">
          <Button variant="secondary">Open architecture</Button>
        </Link>
      </div>

      <PrototypeBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Language', value: project.language },
          { label: 'Framework', value: project.framework },
          { label: 'Source', value: project.source },
          { label: 'Last analyzed', value: formatDate(project.lastAnalyzed) },
        ].map((item) => (
          <Card key={item.label}>
            <p className="text-xs text-ink-faint">{item.label}</p>
            <p className="mt-1 text-sm font-semibold capitalize text-ink">
              {item.value}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <p className="text-xs text-ink-faint">Source label</p>
        <p className="mt-1 text-sm text-ink">{project.sourceLabel}</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-ink">Analysis summary</h3>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <Metric label="Files" value={project.metrics.files} />
            <Metric label="Components" value={project.metrics.components} />
            <Metric
              label="Dependencies"
              value={project.metrics.dependencies}
            />
            <Metric label="Modules" value={project.metrics.modules} />
            <Metric
              label="Lines of code"
              value={project.metrics.linesOfCode}
            />
            <Metric
              label="Avg complexity"
              value={project.metrics.avgComplexity}
              raw
            />
            <Metric
              label="Coupling score"
              value={project.metrics.couplingScore}
              raw
            />
            <Metric
              label="Coverage estimate"
              value={`${project.metrics.coverageEstimate}%`}
              raw
            />
          </dl>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-ink">
            Component type mix
          </h3>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={2}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#18212b',
                    border: '1px solid #243041',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pieData.map((d, i) => (
              <Badge key={d.name} tone="neutral">
                <span
                  className="mr-1.5 inline-block h-2 w-2 rounded-full"
                  style={{ background: colors[i % colors.length] }}
                />
                {d.name} ({d.value})
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  raw,
}: {
  label: string
  value: number | string
  raw?: boolean
}) {
  return (
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums text-ink">
        {raw || typeof value === 'string' ? value : formatNumber(value)}
      </dd>
    </div>
  )
}
