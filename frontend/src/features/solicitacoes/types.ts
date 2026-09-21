// Contrato com a API (veja docs/openapi.yaml).
// As listas "as const" servem de fonte única para os tipos, os selects e a validação.

export const CATEGORIAS = ['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO'] as const
export const PRIORIDADES = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'] as const
export const STATUS = ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA'] as const

export type Categoria = (typeof CATEGORIAS)[number]
export type Prioridade = (typeof PRIORIDADES)[number]
export type Status = (typeof STATUS)[number]

function pertence<T extends string>(valores: readonly T[], valor: unknown): valor is T {
  return typeof valor === 'string' && (valores as readonly string[]).includes(valor)
}

export const isCategoria = (valor: unknown): valor is Categoria => pertence(CATEGORIAS, valor)
export const isPrioridade = (valor: unknown): valor is Prioridade => pertence(PRIORIDADES, valor)
export const isStatus = (valor: unknown): valor is Status => pertence(STATUS, valor)

export interface Solicitacao {
  id: number
  protocolo: string
  nome_solicitante: string
  categoria: Categoria
  prioridade: Prioridade
  status: Status
  /** Próximos status possíveis a partir do atual (vazio nos status finais). */
  status_permitidos: Status[]
  descricao: string
  justificativa_prioridade: string | null
  data_criacao: string
  data_atualizacao: string
}

/** Corpo do POST /solicitacoes. Protocolo, status e datas são gerados pela API. */
export interface NovaSolicitacao {
  nome_solicitante: string
  categoria: Categoria
  prioridade: Prioridade
  descricao: string
  /** Obrigatória quando a prioridade é URGENTE. */
  justificativa_prioridade?: string
}

export interface FiltrosSolicitacao {
  status?: Status
  categoria?: Categoria
  prioridade?: Prioridade
  page?: number
}

export interface PaginaSolicitacoes {
  data: Solicitacao[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}

/** Resposta de GET /solicitacoes/resumo. */
export interface Resumo {
  total: number
  por_status: Record<Status, number>
  por_prioridade: Record<Prioridade, number>
}
