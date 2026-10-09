import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  icon?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-canvas hover:brightness-110 shadow-[0_0_0_1px_rgba(107,138,255,0.35)]',
  secondary:
    'bg-surface-elevated text-ink border border-border hover:bg-surface-hover',
  ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-hover',
  danger: 'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
