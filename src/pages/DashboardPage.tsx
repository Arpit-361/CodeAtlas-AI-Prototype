import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Boxes,
  FileCode2,
  FolderOpen,
  GitBranch,
  Network,
  Sparkles,
  Upload,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { ProjectStatusBadge } from '../components/common/StatusBadge'
import { PrototypeBanner } from '../components/common/PrototypeBanner'
import { useProject } from '../context/ProjectContext'
import { DASHBOARD_STATS, RECENT_PROJECTS, SAMPLE_PROJECT } from '../data'
import { formatDate, formatNumber } from '../utilities/format'

const chartData = [
  { name: 'Files', value: SAMPLE_PROJECT.metrics.files },
  { name: 'Components', value: SAMPLE_PROJECT.metrics.components },
  { name: 'Deps', value: SAMPLE_PROJECT.metrics.dependencies },
  { name: 'Modules', value: SAMPLE_PROJECT.metrics.modules },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const { hasProject, openSampleProject } = useProject()

  const handleOpenSample = () => {
    openSampleProject()
    navigate('/architecture')
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 fade-in">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(ellipse at 0% 0%, rgba(107,138,255,0.18), transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(167,139,250,0.12), transparent 45%), linear-gradient(135deg, #121820 0%, #0e1520 100%)',
          }}
        />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="slide-up">
            <Badge tone="violet" className="mb-3">
              Developer intelligence
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              CodeAtlas AI
            </h2>
            <p className="mt-2 text-lg text-ink-muted">
              Understand Your Codebase
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
              Explore repository structure, dependency graphs, and component
              relationships with a polished architecture workspace. This
              prototype uses realistic mock data — no live analysis runs.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                icon={<Upload className="h-4 w-4" />}
                onClick={() => navigate('/import')}
              >
                Import repository
              </Button>
              <Button
                variant="secondary"
                icon={<Sparkles className="h-4 w-4" />}
                onClick={handleOpenSample}
              >
                Open sample project
              </Button>
            </div>
          </div>

          <Card className="relative border-border/80 bg-surface-elevated/80 backdrop-blur slide-up">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
              Sample snapshot
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">
              {SAMPLE_PROJECT.name}
            </p>
            <div className="mt-4 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={18}>
                  <CartesianGrid stroke="#243041" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#8b9bb0', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: '#18212b',
                      border: '1px solid #243041',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="#6b8aff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>

      <PrototypeBanner />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Projects',
            value: DASHBOARD_STATS.totalProjects,
            icon: FolderOpen,
          },
          {
            label: 'Files indexed',
            value: DASHBOARD_STATS.totalFiles,
            icon: FileCode2,
          },
          {
            label: 'Components',
            value: DASHBOARD_STATS.totalComponents,
            icon: Boxes,
          },
          {
            label: 'Dependencies',
            value: DASHBOARD_STATS.totalDependencies,
            icon: GitBranch,
          },
        ].map((stat) => (
          <Card key={stat.label} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <stat.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-ink-faint">{stat.label}</p>
              <p className="text-xl font-semibold tabular-nums text-ink">
                {formatNumber(stat.value)}
              </p>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card padding="none">
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
            <h3 className="text-sm font-semibold text-ink">Recent projects</h3>
            <span className="text-xs text-ink-faint">Local mock list</span>
          </div>
          <ul className="divide-y divide-border-subtle">
            {RECENT_PROJECTS.map((proj) => (
              <li
                key={proj.id}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-hover/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {proj.name}
                  </p>
                  <p className="text-xs text-ink-faint">
                    {proj.language} · {formatDate(proj.lastOpened)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ProjectStatusBadge status={proj.status} />
                  {proj.id === SAMPLE_PROJECT.id && (
                    <Button size="sm" variant="secondary" onClick={handleOpenSample}>
                      Open
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-ink">Quick actions</h3>
          <div className="mt-3 space-y-2">
            <QuickAction
              to="/import"
              icon={Upload}
              title="Import a repository"
              description="GitHub URL or ZIP — simulated analysis only"
            />
            <QuickAction
              to={hasProject ? '/architecture' : '/import'}
              icon={Network}
              title="Explore architecture"
              description="Interactive Cytoscape dependency graph"
            />
            <QuickAction
              to={hasProject ? '/assistant' : '/import'}
              icon={Sparkles}
              title="Ask the AI assistant"
              description="Mock Q&A grounded in sample project data"
            />
          </div>
        </Card>
      </section>
    </div>
  )
}

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: string
  icon: typeof Upload
  title: string
  description: string
}) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 rounded-lg border border-border bg-surface-elevated px-3 py-3 transition hover:border-accent/30 hover:bg-surface-hover"
    >
      <div className="mt-0.5 text-accent">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 text-ink-faint" />
    </Link>
  )
}
