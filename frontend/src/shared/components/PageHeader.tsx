import type { ReactNode } from 'react'

interface PageHeaderProps {
  titulo: string
  acoes?: ReactNode
}

export function PageHeader({ titulo, acoes }: PageHeaderProps) {
  return (
    <div className="page-header">
      <h1>{titulo}</h1>
      {acoes && <div className="page-header__acoes">{acoes}</div>}
    </div>
  )
}
