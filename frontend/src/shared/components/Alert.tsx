import type { ReactNode } from 'react'

interface AlertProps {
  variant: 'sucesso' | 'erro'
  children: ReactNode
}

// Sucesso é anunciado de forma educada (status); erro interrompe a leitura (alert).
export function Alert({ variant, children }: AlertProps) {
  return (
    <div className={`alerta alerta--${variant}`} role={variant === 'erro' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}
