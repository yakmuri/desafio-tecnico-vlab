import { Link, useLocation, useParams } from 'react-router-dom'
import { isNotFound } from '../../../api/errors'
import { Alert } from '../../../shared/components/Alert'
import { EmptyState } from '../../../shared/components/EmptyState'
import { ErrorState } from '../../../shared/components/ErrorState'
import { LoadingState } from '../../../shared/components/LoadingState'
import { PageHeader } from '../../../shared/components/PageHeader'
import { formatarDataHora } from '../../../shared/format'
import { usePageTitle } from '../../../shared/hooks/usePageTitle'
import { AlterarStatus } from '../components/AlterarStatus'
import { PrioridadeBadge } from '../components/PrioridadeBadge'
import { StatusBadge } from '../components/StatusBadge'
import { useSolicitacao } from '../hooks'
import { CATEGORIA_LABEL } from '../labels'
import { NaoEncontradaPage } from './NaoEncontradaPage'

// Mensagem de sucesso enviada pela tela de criação junto da navegação.
function lerMensagem(state: unknown): string | null {
  if (
    typeof state === 'object' &&
    state !== null &&
    'mensagem' in state &&
    typeof state.mensagem === 'string'
  ) {
    return state.mensagem
  }
  return null
}

export function DetalheSolicitacaoPage() {
  const { id } = useParams()

  // Só números inteiros positivos são ids válidos; qualquer outra coisa é "não encontrada".
  if (id === undefined || !/^\d+$/.test(id)) return <NaoEncontradaPage />

  return <DetalheConteudo id={Number(id)} />
}

function DetalheConteudo({ id }: { id: number }) {
  const { state } = useLocation()
  const mensagem = lerMensagem(state)
  const { data, isPending, isError, error, refetch } = useSolicitacao(id)

  usePageTitle(data ? `Solicitação ${data.protocolo}` : 'Solicitação')

  return (
    <>
      <Link className="voltar" to="/solicitacoes">
        ← Voltar para a lista
      </Link>

      {isPending && <LoadingState label="Carregando solicitação…" />}

      {isError &&
        (isNotFound(error) ? (
          <EmptyState
            title="Solicitação não encontrada"
            description="Ela pode ter sido removida ou o endereço está incorreto."
          />
        ) : (
          <ErrorState message={error.message} onRetry={() => void refetch()} />
        ))}

      {data && (
        <>
          <PageHeader titulo={`Solicitação ${data.protocolo}`} />

          {mensagem && <Alert variant="sucesso">{mensagem}</Alert>}

          <dl className="detalhes">
            <div>
              <dt>Solicitante</dt>
              <dd>{data.nome_solicitante}</dd>
            </div>
            <div>
              <dt>Categoria</dt>
              <dd>{CATEGORIA_LABEL[data.categoria]}</dd>
            </div>
            <div>
              <dt>Prioridade</dt>
              <dd>
                <PrioridadeBadge prioridade={data.prioridade} />
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={data.status} />
              </dd>
            </div>
            <div className="detalhes__largo">
              <dt>Descrição</dt>
              <dd>{data.descricao}</dd>
            </div>
            {data.justificativa_prioridade && (
              <div className="detalhes__largo">
                <dt>Justificativa da prioridade</dt>
                <dd>{data.justificativa_prioridade}</dd>
              </div>
            )}
            <div>
              <dt>Criada em</dt>
              <dd>{formatarDataHora(data.data_criacao)}</dd>
            </div>
            <div>
              <dt>Atualizada em</dt>
              <dd>{formatarDataHora(data.data_atualizacao)}</dd>
            </div>
          </dl>

          <AlterarStatus solicitacao={data} />
        </>
      )}
    </>
  )
}
