import { useId, useRef, useState } from 'react'
import { Alert } from '../../../shared/components/Alert'
import { useAlterarStatus } from '../hooks'
import { STATUS_LABEL } from '../labels'
import type { Solicitacao, Status } from '../types'
import { StatusBadge } from './StatusBadge'

export function AlterarStatus({ solicitacao }: { solicitacao: Solicitacao }) {
  const tituloId = useId()
  const titulo = useRef<HTMLHeadingElement>(null)
  const alterar = useAlterarStatus(solicitacao.id)
  const [mensagem, setMensagem] = useState<string | null>(null)

  // A API informa os próximos status válidos; a tela só oferece essas opções.
  const permitidos = solicitacao.status_permitidos

  function mover(novo: Status) {
    if (
      novo === 'CANCELADA' &&
      !window.confirm('Cancelar esta solicitação? Este status é final e não poderá ser alterado.')
    ) {
      return
    }

    setMensagem(null)
    alterar.reset()
    alterar.mutate(novo, {
      onSuccess: (atualizada) => {
        setMensagem(`Status alterado para ${STATUS_LABEL[atualizada.status]}.`)
        // O botão clicado pode sumir da tela; o foco vai para o título do painel para não se perder.
        titulo.current?.focus()
      },
    })
  }

  return (
    <section className="painel" aria-labelledby={tituloId} aria-busy={alterar.isPending}>
      <h2 id={tituloId} ref={titulo} tabIndex={-1}>
        Atualizar status
      </h2>

      {mensagem && <Alert variant="sucesso">{mensagem}</Alert>}
      {alterar.isError && <Alert variant="erro">{alterar.error.message}</Alert>}

      {permitidos.length === 0 ? (
        <p>Este é um status final: a solicitação não permite nova alteração.</p>
      ) : (
        <>
          <p>
            Status atual: <StatusBadge status={solicitacao.status} />
          </p>
          <div className="painel__acoes">
            {permitidos.map((status) => (
              <button
                key={status}
                type="button"
                className={status === 'CANCELADA' ? 'btn btn--perigo' : 'btn btn--primario'}
                disabled={alterar.isPending}
                onClick={() => mover(status)}
              >
                {status === 'CANCELADA' ? 'Cancelar solicitação' : `Mover para ${STATUS_LABEL[status]}`}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
