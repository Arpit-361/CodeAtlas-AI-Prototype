import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileArchive, FolderGit2, Sparkles } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { PrototypeBanner } from '../components/common/PrototypeBanner'
import { useProject } from '../context/ProjectContext'
import { validateImportInput } from '../utilities/validation'

export function ImportPage() {
  const navigate = useNavigate()
  const { openSampleProject, setAnalyzing } = useProject()
  const fileRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = validateImportInput({ url, file })
    if (!result.ok) {
      setError(result.error ?? 'Invalid input')
      return
    }
    setError(null)
    setAnalyzing(true)

    const source = file ? 'zip-upload' : 'github-url'
    const label = file ? file.name : url.trim()

    navigate('/analysis', {
      state: {
        source,
        label,
        simulated: true,
      },
    })
  }

  const onOpenSample = () => {
    openSampleProject()
    navigate('/architecture')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6 fade-in">
      <div>
        <h2 className="text-xl font-semibold text-ink">Import repository</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Provide a GitHub URL or ZIP archive. Analysis is simulated and always
          loads the TaskFlow sample dataset.
        </p>
      </div>

      <PrototypeBanner message="This prototype never fetches GitHub or unpacks ZIP files. Whatever you enter only labels the simulated session." />

      <Card>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="repo-url"
              className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink"
            >
              <FolderGit2 className="h-4 w-4 text-ink-muted" />
              GitHub repository URL
            </label>
            <input
              id="repo-url"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (e.target.value) setFile(null)
                setError(null)
              }}
              placeholder="https://github.com/org/repo"
              className="h-10 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
              disabled={Boolean(file)}
            />
          </div>

          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider text-ink-faint">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink">
              <FileArchive className="h-4 w-4 text-ink-muted" />
              Upload ZIP archive
            </label>
            <div
              className={`rounded-xl border border-dashed px-4 py-8 text-center transition ${
                file
                  ? 'border-accent/40 bg-accent/5'
                  : 'border-border bg-surface-elevated hover:border-accent/30'
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".zip,application/zip"
                className="hidden"
                onChange={(e) => {
                  const next = e.target.files?.[0] ?? null
                  setFile(next)
                  if (next) setUrl('')
                  setError(null)
                }}
              />
              {file ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-ink">{file.name}</p>
                  <p className="text-xs text-ink-faint">
                    {(file.size / 1024).toFixed(1)} KB · will not be parsed
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setFile(null)
                      if (fileRef.current) fileRef.current.value = ''
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-ink-muted">
                    Drop a .zip here or browse
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                    disabled={Boolean(url.trim())}
                  >
                    Choose file
                  </Button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div
              className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="submit">Start simulated analysis</Button>
            <Button
              type="button"
              variant="secondary"
              icon={<Sparkles className="h-4 w-4" />}
              onClick={onOpenSample}
            >
              Skip to sample project
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
