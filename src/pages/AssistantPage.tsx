import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Bot, MessageSquareText, Send, User } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { PrototypeBanner } from '../components/common/PrototypeBanner'
import { useProject } from '../context/ProjectContext'
import { getMockAiResponse, SUGGESTED_PROMPTS } from '../data'
import type { ChatMessage } from '../types'

function makeId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function AssistantPage() {
  const { hasProject, project } = useProject()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content:
        'Prototype assistant ready. Answers are canned responses matched to keywords against the TaskFlow sample — no LLM is called.',
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || thinking) return

    const userMsg: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)

    window.setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: getMockAiResponse(trimmed),
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setThinking(false)
    }, 600 + Math.random() * 500)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  if (!hasProject) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="Assistant unavailable"
        description="Load a project first so the mock assistant can answer from sample architecture data."
        action={
          <Link to="/import">
            <Button>Import repository</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-4 p-4 sm:p-6 fade-in">
      <div>
        <h2 className="text-lg font-semibold text-ink">AI assistant</h2>
        <p className="text-sm text-ink-muted">
          Ask about {project?.name ?? 'the sample project'} using prototype Q&A
        </p>
      </div>

      <PrototypeBanner message="Responses are keyword-matched mock text from sample data. This is not a live language model." />

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => send(p.prompt)}
            disabled={thinking}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-ink-muted transition hover:border-accent/30 hover:text-ink disabled:opacity-40"
          >
            {p.label}
          </button>
        ))}
      </div>

      <Card padding="none" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:max-h-[calc(100vh-360px)]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role !== 'user' && (
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    msg.role === 'system'
                      ? 'bg-violet/15 text-violet'
                      : 'bg-accent/15 text-accent'
                  }`}
                >
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-accent text-canvas'
                    : msg.role === 'system'
                      ? 'border border-border bg-surface-elevated text-ink-muted'
                      : 'border border-border bg-surface-elevated text-ink'
                }`}
              >
                {msg.content.split('**').map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="font-semibold">
                      {part}
                    </strong>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </div>
              {msg.role === 'user' && (
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-ink-muted">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}
          {thinking && (
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              Generating mock response…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={onSubmit}
          className="flex gap-2 border-t border-border-subtle p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about architecture, deps, auth…"
            className="h-10 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            disabled={thinking}
          />
          <Button
            type="submit"
            disabled={!input.trim() || thinking}
            icon={<Send className="h-4 w-4" />}
          >
            Send
          </Button>
        </form>
      </Card>
    </div>
  )
}
