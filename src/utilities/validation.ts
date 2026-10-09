const GITHUB_URL_RE =
  /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?(\.git)?$/i

export function isValidGithubUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  return GITHUB_URL_RE.test(trimmed)
}

export function isValidZipFile(file: File | null): boolean {
  if (!file) return false
  const name = file.name.toLowerCase()
  return name.endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed'
}

export function validateImportInput(options: {
  url: string
  file: File | null
}): { ok: boolean; error?: string } {
  const hasUrl = options.url.trim().length > 0
  const hasFile = options.file !== null

  if (!hasUrl && !hasFile) {
    return { ok: false, error: 'Provide a GitHub URL or select a ZIP file.' }
  }
  if (hasUrl && hasFile) {
    return { ok: false, error: 'Use either a GitHub URL or a ZIP file, not both.' }
  }
  if (hasUrl && !isValidGithubUrl(options.url)) {
    return {
      ok: false,
      error: 'Enter a valid GitHub repository URL (e.g. https://github.com/org/repo).',
    }
  }
  if (hasFile && !isValidZipFile(options.file)) {
    return { ok: false, error: 'Only .zip archives are accepted in this prototype.' }
  }
  return { ok: true }
}
