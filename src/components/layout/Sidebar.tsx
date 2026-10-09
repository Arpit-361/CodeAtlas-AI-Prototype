import { NavLink } from 'react-router-dom'
import {
  Boxes,
  FolderGit2,
  GitBranch,
  LayoutDashboard,
  MessageSquareText,
  Network,
  PanelLeftClose,
  PanelLeft,
  Upload,
} from 'lucide-react'
import { useProject } from '../../context/ProjectContext'

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/import', label: 'Import', icon: Upload },
  { to: '/architecture', label: 'Architecture', icon: Network, requiresProject: true },
  { to: '/dependencies', label: 'Dependencies', icon: GitBranch, requiresProject: true },
  { to: '/components', label: 'Components', icon: Boxes, requiresProject: true },
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquareText, requiresProject: true },
  { to: '/project', label: 'Project', icon: FolderGit2, requiresProject: true },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { hasProject } = useProject()

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface transition-all duration-200 lg:static lg:translate-x-0 ${
          collapsed ? 'w-[68px]' : 'w-60'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div
          className={`flex h-14 items-center border-b border-border-subtle px-3 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-violet text-xs font-bold text-canvas">
              CA
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight text-ink">
                  CodeAtlas AI
                </div>
                <div className="text-[10px] uppercase tracking-wider text-ink-faint">
                  Prototype
                </div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              type="button"
              onClick={onToggle}
              className="hidden rounded-md p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink lg:inline-flex"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="mx-auto mt-2 hidden rounded-md p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink lg:inline-flex"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {navItems.map((item) => {
            const locked = Boolean(item.requiresProject && !hasProject)
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={(e) => {
                  if (locked) {
                    e.preventDefault()
                    return
                  }
                  onCloseMobile()
                }}
                title={
                  locked
                    ? 'Open or import a project first'
                    : collapsed
                      ? item.label
                      : undefined
                }
                className={({ isActive }) =>
                  `group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition ${
                    locked
                      ? 'cursor-not-allowed opacity-35'
                      : isActive
                        ? 'bg-accent/15 text-ink'
                        : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive && !locked ? 'text-accent' : ''
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {!collapsed && (
          <div className="border-t border-border-subtle p-3">
            <p className="text-[11px] leading-relaxed text-ink-faint">
              Frontend prototype with mock architecture data. No backend analysis.
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
