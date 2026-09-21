import { CATEGORIAS, PRIORIDADES, STATUS } from './types'
import type { Categoria, Prioridade, Status } from './types'

export const STATUS_LABEL: Record<Status, string> = {
  RECEBIDA: 'Recebida',
  EM_ANALISE: 'Em análise',
  AGENDADA: 'Agendada',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
}

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  CONSULTA: 'Consulta',
  EXAME: 'Exame',
  VACINACAO: 'Vacinação',
  OUTRO: 'Outro',
}

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  URGENTE: 'Urgente',
}

export const STATUS_OPCOES = STATUS.map((valor) => ({ valor, rotulo: STATUS_LABEL[valor] }))
export const CATEGORIA_OPCOES = CATEGORIAS.map((valor) => ({ valor, rotulo: CATEGORIA_LABEL[valor] }))
export const PRIORIDADE_OPCOES = PRIORIDADES.map((valor) => ({ valor, rotulo: PRIORIDADE_LABEL[valor] }))
