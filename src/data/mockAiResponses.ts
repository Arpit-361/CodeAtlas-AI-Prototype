import type { SuggestedPrompt } from '../types'

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'p1',
    label: 'Entry point',
    prompt: 'Where does the application start?',
  },
  {
    id: 'p2',
    label: 'Task flow',
    prompt: 'How does a task get created from an HTTP request?',
  },
  {
    id: 'p3',
    label: 'Database layer',
    prompt: 'Which modules talk to the database?',
  },
  {
    id: 'p4',
    label: 'Coupling risks',
    prompt: 'What looks most tightly coupled in this architecture?',
  },
  {
    id: 'p5',
    label: 'Auth path',
    prompt: 'How does authentication work in this codebase?',
  },
]

/**
 * Keyword → canned answer map. Responses are prototype mock text only —
 * no LLM inference is performed.
 */
const RESPONSE_RULES: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ['start', 'entry', 'main', 'boot'],
    answer:
      '**Prototype answer (mock data):** The app boots from `app/main.py`, which creates the Flask application, loads `config.py`, registers route blueprints (`task_routes`, `user_routes`, `health_routes`), and binds the SQLAlchemy session factory.\n\nThis is simulated guidance from the sample TaskFlow project — not live source analysis.',
  },
  {
    keywords: ['task', 'create', 'request', 'http', 'endpoint', 'route'],
    answer:
      '**Prototype answer (mock data):** Task creation flows as:\n1. `task_routes` receives the HTTP request\n2. `validate_payload` checks the body\n3. `TaskService` persists via `SessionLocal` using the `Task` / `Project` models\n4. `NotificationService` may emit a follow-up event\n\nEdges in the Architecture Explorer mirror this call chain in the sample graph.',
  },
  {
    keywords: ['database', 'db', 'sql', 'session', 'persist'],
    answer:
      '**Prototype answer (mock data):** Persistence is centralized in the `db` module:\n- `create_engine` builds the engine from config\n- `SessionLocal` provides sessions\n- `TaskService` and `UserService` are the primary callers\n- Models (`Task`, `User`, `Project`) map to tables through that engine\n\n`health_routes` also touches the session for readiness checks.',
  },
  {
    keywords: ['coupl', 'tight', 'depend', 'risk', 'complex'],
    answer:
      '**Prototype answer (mock data):** Highest coupling in the sample:\n- `TaskService` depends on models, DB session, notifications, and formatting utils\n- `mod-app` fans out to routes, services, models, utils, and db\n- Shared `validate_payload` / `create_access_token` sit on multiple route paths\n\nThese observations come from the static mock edge list, not a real analyzer.',
  },
  {
    keywords: ['auth', 'token', 'jwt', 'login', 'password'],
    answer:
      '**Prototype answer (mock data):** Auth is handled in the user path:\n- `user_routes` accepts credentials\n- `UserService` verifies the user and hashes passwords\n- `create_access_token` issues a signed JWT\n\nThere is no real token verification middleware modeled beyond these sample nodes.',
  },
  {
    keywords: ['notif', 'email', 'webhook'],
    answer:
      '**Prototype answer (mock data):** `NotificationService` is marked experimental. It is called from `TaskService` after task mutations and uses `User` plus `format_datetime` to compose outbound messages. No external provider integration is modeled in this prototype.',
  },
  {
    keywords: ['test', 'pytest', 'coverage'],
    answer:
      '**Prototype answer (mock data):** `tests/test_tasks.py` imports `task_routes` and `TaskService` to exercise the happy-path create/update flows. Reported coverage (~71%) is a dashboard metric from mock project stats only.',
  },
]

const FALLBACK_ANSWER =
  '**Prototype answer (mock data):** I can only answer from the sample TaskFlow architecture. Try asking about the entry point, task creation flow, database layer, coupling, or authentication.\n\nNo live LLM is connected in this prototype.'

export function getMockAiResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  for (const rule of RESPONSE_RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return rule.answer
    }
  }
  return FALLBACK_ANSWER
}
