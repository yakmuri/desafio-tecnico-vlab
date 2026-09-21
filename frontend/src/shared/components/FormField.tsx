import { useId } from 'react'
import type { ReactNode } from 'react'

/** Props de acessibilidade que o campo (input, select, textarea) precisa receber. */
export interface ControleProps {
  id: string
  'aria-invalid': boolean
  'aria-required': boolean
  'aria-describedby': string | undefined
}

interface FormFieldProps {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: (controle: ControleProps) => ReactNode
}

// Liga rótulo, dica e mensagem de erro ao controle, para leitores de tela e para o clique no rótulo.
export function FormField({ label, required = false, hint, error, children }: FormFieldProps) {
  const id = useId()
  const dicaId = hint ? `${id}-dica` : undefined
  const erroId = error ? `${id}-erro` : undefined
  const descritoPor = [dicaId, erroId].filter(Boolean).join(' ') || undefined

  return (
    <div className="campo">
      <label htmlFor={id}>
        {label}
        {required && (
          <span className="campo__obrigatorio" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={dicaId} className="campo__dica">
          {hint}
        </p>
      )}
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-required': required,
        'aria-describedby': descritoPor,
      })}
      {error && (
        <p id={erroId} className="campo__erro">
          {error}
        </p>
      )}
    </div>
  )
}
