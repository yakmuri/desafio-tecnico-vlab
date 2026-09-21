import { Link } from 'react-router-dom'
import { formatarDataHora } from '../../../shared/format'
import { CATEGORIA_LABEL } from '../labels'
import type { Solicitacao } from '../types'
import { PrioridadeBadge } from './PrioridadeBadge'
import { StatusBadge } from './StatusBadge'

// Visão para telas largas. Em telas estreitas, quem aparece é SolicitacaoCartoes.
export function SolicitacaoTable({ itens }: { itens: Solicitacao[] }) {
  return (
    <div className="somente-tabela tabela-wrapper">
      <table className="tabela">
        <caption className="visually-hidden">Lista de solicitações</caption>
        <thead>
          <tr>
            <th scope="col">Protocolo</th>
            <th scope="col">Solicitante</th>
            <th scope="col">Categoria</th>
            <th scope="col">Prioridade</th>
            <th scope="col">Status</th>
            <th scope="col">Criada em</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((solicitacao) => (
            <tr key={solicitacao.id}>
              <th scope="row">
                <Link to={`/solicitacoes/${solicitacao.id}`}>{solicitacao.protocolo}</Link>
              </th>
              <td>{solicitacao.nome_solicitante}</td>
              <td>{CATEGORIA_LABEL[solicitacao.categoria]}</td>
              <td>
                <PrioridadeBadge prioridade={solicitacao.prioridade} />
              </td>
              <td>
                <StatusBadge status={solicitacao.status} />
              </td>
              <td>{formatarDataHora(solicitacao.data_criacao)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
