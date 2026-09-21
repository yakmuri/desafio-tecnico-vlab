import { Link } from 'react-router-dom'
import { formatarDataHora } from '../../../shared/format'
import { CATEGORIA_LABEL } from '../labels'
import type { Solicitacao } from '../types'
import { PrioridadeBadge } from './PrioridadeBadge'
import { StatusBadge } from './StatusBadge'

// Visão para celulares: a mesma informação da tabela, empilhada em cartões.
export function SolicitacaoCartoes({ itens }: { itens: Solicitacao[] }) {
  return (
    <ul className="somente-cartoes cartoes" aria-label="Lista de solicitações">
      {itens.map((solicitacao) => (
        <li key={solicitacao.id} className="cartao">
          <Link className="cartao__titulo" to={`/solicitacoes/${solicitacao.id}`}>
            {solicitacao.protocolo}
          </Link>
          <p className="cartao__meta">
            {solicitacao.nome_solicitante} · {CATEGORIA_LABEL[solicitacao.categoria]}
          </p>
          <p className="cartao__linha">
            <PrioridadeBadge prioridade={solicitacao.prioridade} />
            <StatusBadge status={solicitacao.status} />
          </p>
          <p className="cartao__meta">Criada em {formatarDataHora(solicitacao.data_criacao)}</p>
        </li>
      ))}
    </ul>
  )
}
