import { Link } from 'react-router-dom'
import { EmptyState } from '../../../shared/components/EmptyState'
import { ErrorState } from '../../../shared/components/ErrorState'
import { LoadingState } from '../../../shared/components/LoadingState'
import { PageHeader } from '../../../shared/components/PageHeader'
import { usePageTitle } from '../../../shared/hooks/usePageTitle'
import { ResumoGrupo } from '../components/ResumoGrupo'
import { useResumo } from '../hooks'
import { PRIORIDADE_OPCOES, STATUS_OPCOES } from '../labels'

export function DashboardPage() {
  usePageTitle('Início')
  const { data, isPending, isError, error, refetch } = useResumo()

  return (
    <>
      <PageHeader
        titulo="Resumo das solicitações"
        acoes={
          <Link className="btn btn--primario" to="/solicitacoes/nova">
            Nova solicitação
          </Link>
        }
      />

      {isPending && <LoadingState label="Carregando resumo…" />}
      {isError && <ErrorState message={error.message} onRetry={() => void refetch()} />}

      {data && data.total === 0 && (
        <EmptyState
          title="Ainda não há solicitações"
          description="Cadastre a primeira para ver o resumo aqui."
        >
          <Link className="btn btn--primario" to="/solicitacoes/nova">
            Criar solicitação
          </Link>
        </EmptyState>
      )}

      {data && data.total > 0 && (
        <>
          <p className="resumo-total">
            Total: <strong>{data.total}</strong> {data.total === 1 ? 'solicitação' : 'solicitações'}
          </p>
          <ResumoGrupo
            titulo="Por status"
            total={data.total}
            itens={STATUS_OPCOES.map(({ valor, rotulo }) => ({
              rotulo,
              quantidade: data.por_status[valor],
              destino: `/solicitacoes?status=${valor}`,
            }))}
          />
          <ResumoGrupo
            titulo="Por prioridade"
            total={data.total}
            itens={PRIORIDADE_OPCOES.map(({ valor, rotulo }) => ({
              rotulo,
              quantidade: data.por_prioridade[valor],
              destino: `/solicitacoes?prioridade=${valor}`,
            }))}
          />
        </>
      )}
    </>
  )
}
