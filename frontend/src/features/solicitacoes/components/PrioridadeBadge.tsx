import { PRIORIDADE_LABEL } from '../labels'
import type { Prioridade } from '../types'

export function PrioridadeBadge({ prioridade }: { prioridade: Prioridade }) {
  return <span className={`badge badge--${prioridade.toLowerCase()}`}>{PRIORIDADE_LABEL[prioridade]}</span>
}
