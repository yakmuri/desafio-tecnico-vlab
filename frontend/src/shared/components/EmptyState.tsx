import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  children?: ReactNode
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="state">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}
