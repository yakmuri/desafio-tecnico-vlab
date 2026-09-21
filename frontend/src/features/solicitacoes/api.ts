import { http } from '../../api/http'
import type {
  FiltrosSolicitacao,
  NovaSolicitacao,
  PaginaSolicitacoes,
  Resumo,
  Solicitacao,
  Status,
} from './types'

// A API embrulha os objetos únicos em { data: ... }.
interface Envelope<T> {
  data: T
}

export async function listarSolicitacoes(filtros: FiltrosSolicitacao): Promise<PaginaSolicitacoes> {
  const { data } = await http.get<PaginaSolicitacoes>('/solicitacoes', { params: filtros })
  return data
}

export async function buscarSolicitacao(id: number): Promise<Solicitacao> {
  const { data } = await http.get<Envelope<Solicitacao>>(`/solicitacoes/${id}`)
  return data.data
}

export async function criarSolicitacao(dados: NovaSolicitacao): Promise<Solicitacao> {
  const { data } = await http.post<Envelope<Solicitacao>>('/solicitacoes', dados)
  return data.data
}

export async function alterarStatus(id: number, status: Status): Promise<Solicitacao> {
  const { data } = await http.patch<Envelope<Solicitacao>>(`/solicitacoes/${id}/status`, { status })
  return data.data
}

export async function buscarResumo(): Promise<Resumo> {
  const { data } = await http.get<Envelope<Resumo>>('/solicitacoes/resumo')
  return data.data
}
