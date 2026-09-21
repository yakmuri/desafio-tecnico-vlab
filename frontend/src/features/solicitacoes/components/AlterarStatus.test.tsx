import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../../api/errors'
import * as api from '../api'
import type { Solicitacao } from '../types'
import { AlterarStatus } from './AlterarStatus'

// Estes testes cobrem, do lado do frontend, a mesma regra de negócio que o backend garante
// em backend/tests/Unit/StatusTransicaoTest.php: só os próximos status permitidos podem ser
// escolhidos, e um status final não oferece nenhuma ação.
vi.mock('../api')
const mockApi = vi.mocked(api)

const base: Solicitacao = {
  id: 1,
  protocolo: 'SOL-20260920-AAAAAA',
  nome_solicitante: 'Maria Teste',
  categoria: 'CONSULTA',
  prioridade: 'BAIXA',
  status: 'RECEBIDA',
  status_permitidos: ['EM_ANALISE', 'CANCELADA'],
  descricao: 'Consulta de rotina',
  justificativa_prioridade: null,
  data_criacao: '2026-09-20T20:16:07+00:00',
  data_atualizacao: '2026-09-20T20:16:07+00:00',
}

function renderComQuery(solicitacao: Solicitacao) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <AlterarStatus solicitacao={solicitacao} />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('AlterarStatus', () => {
  it('oferece só os botões dos status permitidos pela API', () => {
    renderComQuery(base)

    expect(screen.getByRole('button', { name: 'Mover para Em análise' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar solicitação' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Agendada/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Concluída/ })).not.toBeInTheDocument()
  })

  it('em um status final, não oferece nenhuma ação', () => {
    renderComQuery({ ...base, status: 'CONCLUIDA', status_permitidos: [] })

    expect(screen.getByText(/status final/)).toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'Atualizar status' })).queryAllByRole('button'),
    ).toHaveLength(0)
  })

  it('altera o status e mostra a confirmação de sucesso', async () => {
    mockApi.alterarStatus.mockResolvedValue({
      ...base,
      status: 'EM_ANALISE',
      status_permitidos: ['AGENDADA', 'CANCELADA'],
    })

    renderComQuery(base)
    await userEvent.click(screen.getByRole('button', { name: 'Mover para Em análise' }))

    expect(mockApi.alterarStatus).toHaveBeenCalledWith(1, 'EM_ANALISE')
    // O componente só recebe a solicitação atualizada via props (o pai é quem busca de novo);
    // aqui confirmamos que a mutação foi disparada corretamente e o sucesso foi comunicado.
    expect(await screen.findByText('Status alterado para Em análise.')).toBeInTheDocument()
  })

  it('cancelar pede confirmação e não chama a API se o usuário recusar', async () => {
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false)

    renderComQuery(base)
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar solicitação' }))

    expect(confirmar).toHaveBeenCalled()
    expect(mockApi.alterarStatus).not.toHaveBeenCalled()
  })

  it('mostra o erro da API quando a transição é recusada', async () => {
    mockApi.alterarStatus.mockRejectedValue(
      new ApiError('Não é possível alterar o status de RECEBIDA para EM_ANALISE.', 422),
    )

    renderComQuery(base)
    await userEvent.click(screen.getByRole('button', { name: 'Mover para Em análise' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Não é possível alterar o status')
  })
})
