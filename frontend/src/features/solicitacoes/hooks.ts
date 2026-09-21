import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alterarStatus, buscarResumo, buscarSolicitacao, criarSolicitacao, listarSolicitacoes } from './api'
import type { FiltrosSolicitacao, NovaSolicitacao, Status } from './types'

const chaves = {
  todas: ['solicitacoes'] as const,
  lista: (filtros: FiltrosSolicitacao) => ['solicitacoes', 'lista', filtros] as const,
  detalhe: (id: number) => ['solicitacoes', 'detalhe', id] as const,
  resumo: ['solicitacoes', 'resumo'] as const,
}

export function useSolicitacoes(filtros: FiltrosSolicitacao) {
  return useQuery({
    queryKey: chaves.lista(filtros),
    queryFn: () => listarSolicitacoes(filtros),
    // Mantém a página anterior na tela enquanto a nova carrega (evita "piscar").
    placeholderData: keepPreviousData,
  })
}

export function useSolicitacao(id: number) {
  return useQuery({
    queryKey: chaves.detalhe(id),
    queryFn: () => buscarSolicitacao(id),
  })
}

export function useResumo() {
  return useQuery({
    queryKey: chaves.resumo,
    queryFn: buscarResumo,
  })
}

export function useCriarSolicitacao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dados: NovaSolicitacao) => criarSolicitacao(dados),
    // Listas e resumo ficam desatualizados depois de uma criação.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaves.todas }),
  })
}

export function useAlterarStatus(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: Status) => alterarStatus(id, status),
    onSuccess: (atualizada) => {
      // O detalhe recebe a resposta direto; as demais consultas são refeitas.
      queryClient.setQueryData(chaves.detalhe(id), atualizada)
      return queryClient.invalidateQueries({ queryKey: chaves.todas })
    },
  })
}
