import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { TopNav } from '../components/layout/TopNav'

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-full min-h-0 bg-canvas">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
