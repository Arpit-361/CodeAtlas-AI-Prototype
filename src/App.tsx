import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProjectProvider } from './context/ProjectContext'
import { MainLayout } from './layouts/MainLayout'
import { AnalysisProgressPage } from './pages/AnalysisProgressPage'
import { ArchitecturePage } from './pages/ArchitecturePage'
import { AssistantPage } from './pages/AssistantPage'
import { ComponentsPage } from './pages/ComponentsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DependenciesPage } from './pages/DependenciesPage'
import { ImportPage } from './pages/ImportPage'
import { ProjectDetailsPage } from './pages/ProjectDetailsPage'

export default function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="import" element={<ImportPage />} />
            <Route path="analysis" element={<AnalysisProgressPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="dependencies" element={<DependenciesPage />} />
            <Route path="components" element={<ComponentsPage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="project" element={<ProjectDetailsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  )
}
