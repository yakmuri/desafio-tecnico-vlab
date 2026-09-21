import { FormField } from '../../../shared/components/FormField'
import { CATEGORIA_OPCOES, PRIORIDADE_OPCOES, STATUS_OPCOES } from '../labels'
import type { CampoFiltro } from '../filtros'
import type { FiltrosSolicitacao } from '../types'

interface FiltrosSolicitacaoFormProps {
  filtros: FiltrosSolicitacao
  onChange: (campo: CampoFiltro, valor: string) => void
  onLimpar: () => void
  temFiltros: boolean
}

interface Opcao {
  valor: string
  rotulo: string
}

function Opcoes({ opcoes }: { opcoes: Opcao[] }) {
  return (
    <>
      <option value="">Todos</option>
      {opcoes.map(({ valor, rotulo }) => (
        <option key={valor} value={valor}>
          {rotulo}
        </option>
      ))}
    </>
  )
}

export function FiltrosSolicitacaoForm({
  filtros,
  onChange,
  onLimpar,
  temFiltros,
}: FiltrosSolicitacaoFormProps) {
  return (
    // Os filtros são aplicados ao escolher; não há botão de envio.
    <form
      className="filtros"
      aria-label="Filtrar solicitações"
      onSubmit={(evento) => evento.preventDefault()}
    >
      <FormField label="Status">
        {(controle) => (
          <select
            {...controle}
            value={filtros.status ?? ''}
            onChange={(e) => onChange('status', e.target.value)}
          >
            <Opcoes opcoes={STATUS_OPCOES} />
          </select>
        )}
      </FormField>
      <FormField label="Categoria">
        {(controle) => (
          <select
            {...controle}
            value={filtros.categoria ?? ''}
            onChange={(e) => onChange('categoria', e.target.value)}
          >
            <Opcoes opcoes={CATEGORIA_OPCOES} />
          </select>
        )}
      </FormField>
      <FormField label="Prioridade">
        {(controle) => (
          <select
            {...controle}
            value={filtros.prioridade ?? ''}
            onChange={(e) => onChange('prioridade', e.target.value)}
          >
            <Opcoes opcoes={PRIORIDADE_OPCOES} />
          </select>
        )}
      </FormField>
      <div className="campo">
        <button type="button" className="btn" onClick={onLimpar} disabled={!temFiltros}>
          Limpar filtros
        </button>
      </div>
    </form>
  )
}
