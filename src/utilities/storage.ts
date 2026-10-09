const KEYS = {
  lastImport: 'codeatlas:last-import',
  activeProjectId: 'codeatlas:active-project',
} as const

export interface StoredImportMeta {
  source: 'github-url' | 'zip-upload' | 'sample'
  label: string
  at: string
}

export function saveLastImport(meta: StoredImportMeta): void {
  try {
    localStorage.setItem(KEYS.lastImport, JSON.stringify(meta))
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadLastImport(): StoredImportMeta | null {
  try {
    const raw = localStorage.getItem(KEYS.lastImport)
    return raw ? (JSON.parse(raw) as StoredImportMeta) : null
  } catch {
    return null
  }
}

export function saveActiveProjectId(id: string): void {
  try {
    localStorage.setItem(KEYS.activeProjectId, id)
  } catch {
    /* ignore */
  }
}

export function loadActiveProjectId(): string | null {
  try {
    return localStorage.getItem(KEYS.activeProjectId)
  } catch {
    return null
  }
}
