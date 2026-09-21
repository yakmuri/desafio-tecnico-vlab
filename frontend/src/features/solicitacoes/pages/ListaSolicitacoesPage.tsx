import { Link, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../../../shared/components/EmptyState'
import { ErrorState } from '../../../shared/components/ErrorState'
import { LoadingState } from '../../../shared/components/LoadingState'
import { PageHeader } from '../../../shared/components/PageHeader'
import { Pagination } from '../../../shared/components/Pagination'
import { usePageTitle } from '../../../shared/hooks/usePageTitle'
import { FiltrosSolicitacaoForm } from '../components/FiltrosSolicitacaoForm'
import { SolicitacaoCartoes } from '../components/SolicitacaoCartoes'
import { SolicitacaoTable } from '../components/SolicitacaoTable'
import { atualizarParametros, lerFiltros, temFiltrosAtivos } from '../filtros'
import type { CampoFiltro } from '../filtros'
import { useSolicitacoes } from '../hooks'

export function ListaSolicitacoesPage() {
  usePageTitle('Solicitações')

  // Filtros e página moram na URL: o link é compartilhável e o botão "voltar" funciona.
  const [searchParams, setSearchParams] = useSearchParams()
  const filtros = lerFiltros(searchParams)
  const temFiltros = temFiltrosAtivos(filtros)
  const pagina = filtros.page ?? 1

  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } = useSolicitacoes(filtros)

  const mudarFiltro = (campo: CampoFiltro, valor: string) =>
    setSearchParams(atualizarParametros(searchParams, { [campo]: valor, page: '' }))

  const irParaPagina = (proxima: number) =>
    setSearchParams(atualizarParametros(searchParams, { page: String(proxima) }))

  const limpar = () => setSearchParams({})

  return (
    <>
      <PageHeader
        titulo="Solicitações"
        acoes={
          <Link className="btn btn--primario" to="/solicitacoes/nova">
            Nova solicitação
          </Link>
        }
      />

      <FiltrosSolicitacaoForm
        filtros={filtros}
        onChange={mudarFiltro}
        onLimpar={limpar}
        temFiltros={temFiltros}
      />

      <div aria-busy={isFetching} className={isPlaceholderData ? 'is-loading' : undefined}>
        {isPending && <LoadingState label="Carregando solicitações…" />}

        {isError && <ErrorState message={error.message} onRetry={() => void refetch()} />}

        {data && data.data.length === 0 && (
          <EmptyState
            title={temFiltros || pagina > 1 ? 'Nenhuma solicitação encontrada' : 'Ainda não há solicitações'}
            description={
              temFiltros || pagina > 1
                ? 'Nenhum resultado para os filtros ou a página escolhidos.'
                : 'Cadastre a primeira solicitação para vê-la aqui.'
            }
          >
            {temFiltros || pagina > 1 ? (
              <button type="button" className="btn" onClick={limpar}>
                Ver todas as solicitações
              </button>
            ) : (
              <Link className="btn btn--primario" to="/solicitacoes/nova">
                Criar solicitação
              </Link>
            )}
          </EmptyState>
        )}

        {data && data.data.length > 0 && (
          <>
            <p className="resultado-info" role="status">
              Exibindo {data.meta.from}–{data.meta.to} de {data.meta.total}{' '}
              {data.meta.total === 1 ? 'solicitação' : 'solicitações'}
            </p>
            <SolicitacaoTable itens={data.data} />
            <SolicitacaoCartoes itens={data.data} />
            <Pagination
              paginaAtual={data.meta.current_page}
              ultimaPagina={data.meta.last_page}
              onChange={irParaPagina}
            />
          </>
        )}
      </div>
    </>
  )
}
