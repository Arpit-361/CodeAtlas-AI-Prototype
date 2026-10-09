import type {
  ArchitectureEdge,
  ArchitectureNode,
  ComponentRecord,
  DashboardStats,
  DependencyRecord,
  ProjectSummary,
  RecentProject,
} from '../types'

/** Sample project: small Python Flask-style web app (prototype mock data only). */
export const SAMPLE_PROJECT: ProjectSummary = {
  id: 'taskflow-api',
  name: 'TaskFlow API',
  language: 'Python',
  framework: 'Flask',
  source: 'sample',
  sourceLabel: 'Built-in sample (not fetched from GitHub)',
  description:
    'A compact task-management REST API with route handlers, service layer, SQLAlchemy models, and shared utilities. All structure shown here is simulated prototype data.',
  lastAnalyzed: '2026-10-09T10:30:00Z',
  status: 'ready',
  metrics: {
    files: 18,
    components: 24,
    dependencies: 32,
    modules: 6,
    linesOfCode: 2140,
    avgComplexity: 3.4,
    couplingScore: 0.42,
    coverageEstimate: 71,
  },
}

export const DASHBOARD_STATS: DashboardStats = {
  totalProjects: 4,
  totalFiles: 96,
  totalComponents: 128,
  totalDependencies: 214,
}

export const RECENT_PROJECTS: RecentProject[] = [
  {
    id: 'taskflow-api',
    name: 'TaskFlow API',
    language: 'Python',
    lastOpened: '2026-10-09T10:30:00Z',
    status: 'ready',
  },
  {
    id: 'ledger-ui',
    name: 'Ledger UI',
    language: 'TypeScript',
    lastOpened: '2026-10-08T16:12:00Z',
    status: 'ready',
  },
  {
    id: 'pipeline-worker',
    name: 'Pipeline Worker',
    language: 'Go',
    lastOpened: '2026-10-07T09:45:00Z',
    status: 'ready',
  },
  {
    id: 'notify-service',
    name: 'Notify Service',
    language: 'Python',
    lastOpened: '2026-10-05T14:20:00Z',
    status: 'error',
  },
]

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'mod-app',
    name: 'app',
    type: 'module',
    path: 'app/',
    description: 'Application package root — wires routes, services, and config.',
    status: 'stable',
    linesOfCode: 40,
  },
  {
    id: 'mod-routes',
    name: 'routes',
    type: 'module',
    path: 'app/routes/',
    description: 'HTTP route blueprints for tasks, users, and health checks.',
    status: 'stable',
    linesOfCode: 280,
  },
  {
    id: 'mod-services',
    name: 'services',
    type: 'module',
    path: 'app/services/',
    description: 'Business logic layer between routes and persistence.',
    status: 'stable',
    linesOfCode: 520,
  },
  {
    id: 'mod-models',
    name: 'models',
    type: 'module',
    path: 'app/models/',
    description: 'SQLAlchemy ORM models and schema helpers.',
    status: 'stable',
    linesOfCode: 310,
  },
  {
    id: 'mod-utils',
    name: 'utils',
    type: 'module',
    path: 'app/utils/',
    description: 'Shared helpers for validation, auth tokens, and formatting.',
    status: 'stable',
    linesOfCode: 190,
  },
  {
    id: 'mod-db',
    name: 'db',
    type: 'module',
    path: 'app/db/',
    description: 'Database session factory and migration hooks.',
    status: 'stable',
    linesOfCode: 120,
  },
  {
    id: 'file-main',
    name: 'main.py',
    type: 'file',
    path: 'app/main.py',
    description: 'Flask app factory and WSGI entrypoint.',
    status: 'stable',
    linesOfCode: 64,
    complexity: 2,
  },
  {
    id: 'file-config',
    name: 'config.py',
    type: 'file',
    path: 'app/config.py',
    description: 'Environment-driven configuration for DB and secrets.',
    status: 'stable',
    linesOfCode: 48,
    complexity: 1,
  },
  {
    id: 'route-tasks',
    name: 'task_routes',
    type: 'route',
    path: 'app/routes/tasks.py',
    description: 'CRUD endpoints for task resources.',
    status: 'stable',
    linesOfCode: 110,
    complexity: 4,
  },
  {
    id: 'route-users',
    name: 'user_routes',
    type: 'route',
    path: 'app/routes/users.py',
    description: 'User registration, profile, and auth-related endpoints.',
    status: 'stable',
    linesOfCode: 95,
    complexity: 3,
  },
  {
    id: 'route-health',
    name: 'health_routes',
    type: 'route',
    path: 'app/routes/health.py',
    description: 'Liveness and readiness probes.',
    status: 'stable',
    linesOfCode: 28,
    complexity: 1,
  },
  {
    id: 'svc-task',
    name: 'TaskService',
    type: 'service',
    path: 'app/services/task_service.py',
    description: 'Creates, updates, assigns, and filters tasks.',
    status: 'stable',
    linesOfCode: 180,
    complexity: 6,
  },
  {
    id: 'svc-user',
    name: 'UserService',
    type: 'service',
    path: 'app/services/user_service.py',
    description: 'User lifecycle, password hashing, and role checks.',
    status: 'stable',
    linesOfCode: 150,
    complexity: 5,
  },
  {
    id: 'svc-notify',
    name: 'NotificationService',
    type: 'service',
    path: 'app/services/notification_service.py',
    description: 'Emits email/webhook notifications on task events.',
    status: 'experimental',
    linesOfCode: 90,
    complexity: 4,
  },
  {
    id: 'cls-task',
    name: 'Task',
    type: 'class',
    path: 'app/models/task.py',
    description: 'ORM model for task entities (title, status, assignee).',
    status: 'stable',
    linesOfCode: 72,
    complexity: 2,
  },
  {
    id: 'cls-user',
    name: 'User',
    type: 'class',
    path: 'app/models/user.py',
    description: 'ORM model for application users.',
    status: 'stable',
    linesOfCode: 68,
    complexity: 2,
  },
  {
    id: 'cls-project',
    name: 'Project',
    type: 'class',
    path: 'app/models/project.py',
    description: 'ORM model grouping tasks under a project.',
    status: 'stable',
    linesOfCode: 55,
    complexity: 2,
  },
  {
    id: 'fn-validate',
    name: 'validate_payload',
    type: 'function',
    path: 'app/utils/validators.py',
    description: 'JSON schema-style request body validation.',
    status: 'stable',
    linesOfCode: 45,
    complexity: 3,
  },
  {
    id: 'fn-token',
    name: 'create_access_token',
    type: 'function',
    path: 'app/utils/auth.py',
    description: 'Issues signed JWT access tokens.',
    status: 'stable',
    linesOfCode: 38,
    complexity: 2,
  },
  {
    id: 'fn-format',
    name: 'format_datetime',
    type: 'util',
    path: 'app/utils/formatting.py',
    description: 'ISO-8601 datetime formatting helpers.',
    status: 'stable',
    linesOfCode: 22,
    complexity: 1,
  },
  {
    id: 'db-session',
    name: 'SessionLocal',
    type: 'database',
    path: 'app/db/session.py',
    description: 'SQLAlchemy session factory bound to the engine.',
    status: 'critical',
    linesOfCode: 40,
    complexity: 2,
  },
  {
    id: 'db-engine',
    name: 'create_engine',
    type: 'database',
    path: 'app/db/engine.py',
    description: 'Database engine creation from config URL.',
    status: 'critical',
    linesOfCode: 32,
    complexity: 2,
  },
  {
    id: 'file-requirements',
    name: 'requirements.txt',
    type: 'file',
    path: 'requirements.txt',
    description: 'Pinned Python package dependencies.',
    status: 'stable',
    linesOfCode: 18,
  },
  {
    id: 'file-tests',
    name: 'test_tasks.py',
    type: 'file',
    path: 'tests/test_tasks.py',
    description: 'Pytest coverage for task route and service flows.',
    status: 'stable',
    linesOfCode: 140,
    complexity: 3,
  },
]

export const ARCHITECTURE_EDGES: ArchitectureEdge[] = [
  { id: 'e1', source: 'mod-app', target: 'file-main', relation: 'depends' },
  { id: 'e2', source: 'mod-app', target: 'mod-routes', relation: 'depends' },
  { id: 'e3', source: 'mod-app', target: 'mod-services', relation: 'depends' },
  { id: 'e4', source: 'mod-app', target: 'mod-models', relation: 'depends' },
  { id: 'e5', source: 'mod-app', target: 'mod-utils', relation: 'depends' },
  { id: 'e6', source: 'mod-app', target: 'mod-db', relation: 'depends' },
  { id: 'e7', source: 'file-main', target: 'file-config', relation: 'imports' },
  { id: 'e8', source: 'file-main', target: 'route-tasks', relation: 'imports' },
  { id: 'e9', source: 'file-main', target: 'route-users', relation: 'imports' },
  { id: 'e10', source: 'file-main', target: 'route-health', relation: 'imports' },
  { id: 'e11', source: 'file-main', target: 'db-session', relation: 'uses' },
  { id: 'e12', source: 'route-tasks', target: 'svc-task', relation: 'calls' },
  { id: 'e13', source: 'route-tasks', target: 'fn-validate', relation: 'calls' },
  { id: 'e14', source: 'route-users', target: 'svc-user', relation: 'calls' },
  { id: 'e15', source: 'route-users', target: 'fn-token', relation: 'calls' },
  { id: 'e16', source: 'route-users', target: 'fn-validate', relation: 'calls' },
  { id: 'e17', source: 'route-health', target: 'db-session', relation: 'uses' },
  { id: 'e18', source: 'svc-task', target: 'cls-task', relation: 'uses' },
  { id: 'e19', source: 'svc-task', target: 'cls-project', relation: 'uses' },
  { id: 'e20', source: 'svc-task', target: 'db-session', relation: 'uses' },
  { id: 'e21', source: 'svc-task', target: 'svc-notify', relation: 'calls' },
  { id: 'e22', source: 'svc-task', target: 'fn-format', relation: 'calls' },
  { id: 'e23', source: 'svc-user', target: 'cls-user', relation: 'uses' },
  { id: 'e24', source: 'svc-user', target: 'db-session', relation: 'uses' },
  { id: 'e25', source: 'svc-user', target: 'fn-token', relation: 'calls' },
  { id: 'e26', source: 'svc-notify', target: 'cls-user', relation: 'uses' },
  { id: 'e27', source: 'svc-notify', target: 'fn-format', relation: 'calls' },
  { id: 'e28', source: 'cls-task', target: 'cls-user', relation: 'depends' },
  { id: 'e29', source: 'cls-task', target: 'cls-project', relation: 'depends' },
  { id: 'e30', source: 'cls-user', target: 'db-engine', relation: 'uses' },
  { id: 'e31', source: 'cls-project', target: 'db-engine', relation: 'uses' },
  { id: 'e32', source: 'db-session', target: 'db-engine', relation: 'depends' },
  { id: 'e33', source: 'db-engine', target: 'file-config', relation: 'imports' },
  { id: 'e34', source: 'mod-routes', target: 'route-tasks', relation: 'depends' },
  { id: 'e35', source: 'mod-routes', target: 'route-users', relation: 'depends' },
  { id: 'e36', source: 'mod-routes', target: 'route-health', relation: 'depends' },
  { id: 'e37', source: 'mod-services', target: 'svc-task', relation: 'depends' },
  { id: 'e38', source: 'mod-services', target: 'svc-user', relation: 'depends' },
  { id: 'e39', source: 'mod-services', target: 'svc-notify', relation: 'depends' },
  { id: 'e40', source: 'mod-models', target: 'cls-task', relation: 'depends' },
  { id: 'e41', source: 'mod-models', target: 'cls-user', relation: 'depends' },
  { id: 'e42', source: 'mod-models', target: 'cls-project', relation: 'depends' },
  { id: 'e43', source: 'mod-utils', target: 'fn-validate', relation: 'depends' },
  { id: 'e44', source: 'mod-utils', target: 'fn-token', relation: 'depends' },
  { id: 'e45', source: 'mod-utils', target: 'fn-format', relation: 'depends' },
  { id: 'e46', source: 'mod-db', target: 'db-session', relation: 'depends' },
  { id: 'e47', source: 'mod-db', target: 'db-engine', relation: 'depends' },
  { id: 'e48', source: 'file-tests', target: 'route-tasks', relation: 'imports' },
  { id: 'e49', source: 'file-tests', target: 'svc-task', relation: 'imports' },
]

function buildComponentRecords(
  nodes: ArchitectureNode[],
  edges: ArchitectureEdge[],
): ComponentRecord[] {
  return nodes.map((node) => {
    const dependencies = edges
      .filter((e) => e.source === node.id)
      .map((e) => e.target)
    const dependents = edges
      .filter((e) => e.target === node.id)
      .map((e) => e.source)
    return {
      ...node,
      dependencies,
      dependents,
      dependencyCount: dependencies.length,
      dependentCount: dependents.length,
    }
  })
}

function buildDependencyRecords(
  nodes: ArchitectureNode[],
  edges: ArchitectureEdge[],
): DependencyRecord[] {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  return edges.map((edge) => {
    const from = byId.get(edge.source)!
    const to = byId.get(edge.target)!
    return {
      id: edge.id,
      fromId: edge.source,
      toId: edge.target,
      fromName: from.name,
      toName: to.name,
      fromPath: from.path,
      toPath: to.path,
      relation: edge.relation,
      fromType: from.type,
      toType: to.type,
    }
  })
}

export const COMPONENT_RECORDS = buildComponentRecords(
  ARCHITECTURE_NODES,
  ARCHITECTURE_EDGES,
)

export const DEPENDENCY_RECORDS = buildDependencyRecords(
  ARCHITECTURE_NODES,
  ARCHITECTURE_EDGES,
)

export function getNodeById(id: string): ArchitectureNode | undefined {
  return ARCHITECTURE_NODES.find((n) => n.id === id)
}

export function getComponentById(id: string): ComponentRecord | undefined {
  return COMPONENT_RECORDS.find((c) => c.id === id)
}
