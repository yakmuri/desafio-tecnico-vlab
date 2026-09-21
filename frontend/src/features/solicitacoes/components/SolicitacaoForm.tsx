import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toApiError } from '../../../api/errors'
import type { FieldErrors } from '../../../api/errors'
import { Alert } from '../../../shared/components/Alert'
import { FormField } from '../../../shared/components/FormField'
import { useCriarSolicitacao } from '../hooks'
import { CATEGORIA_OPCOES, PRIORIDADE_OPCOES } from '../labels'
import { paraPayload, solicitacaoSchema } from '../schema'
import type { SolicitacaoFormValues } from '../schema'

const CAMPOS: readonly string[] = [
  'nome_solicitante',
  'categoria',
  'prioridade',
  'descricao',
  'justificativa_prioridade',
] satisfies (keyof SolicitacaoFormValues)[]

function isCampo(nome: string): nome is keyof SolicitacaoFormValues {
  return CAMPOS.includes(nome)
}

export function SolicitacaoForm() {
  const navigate = useNavigate()
  const criar = useCriarSolicitacao()
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<SolicitacaoFormValues>({
    resolver: zodResolver(solicitacaoSchema),
    mode: 'onTouched',
    defaultValues: { nome_solicitante: '', descricao: '', justificativa_prioridade: '' },
  })

  const prioridade = useWatch({ control, name: 'prioridade' })

  // Erros de campo devolvidos pela API (422) aparecem junto do campo correspondente.
  function aplicarErrosDoServidor(erros: FieldErrors): number {
    let aplicados = 0
    for (const [campo, mensagens] of Object.entries(erros)) {
      const mensagem = mensagens[0]
      if (isCampo(campo) && mensagem) {
        setError(campo, { type: 'server', message: mensagem }, { shouldFocus: aplicados === 0 })
        aplicados += 1
      }
    }
    return aplicados
  }

  const enviar = handleSubmit(async (valores) => {
    setErroGeral(null)
    try {
      const criada = await criar.mutateAsync(paraPayload(valores))
      void navigate(`/solicitacoes/${criada.id}`, {
        state: { mensagem: `Solicitação criada com sucesso. Protocolo ${criada.protocolo}.` },
      })
    } catch (erro) {
      const apiError = toApiError(erro)
      const aplicados = aplicarErrosDoServidor(apiError.fieldErrors)
      setErroGeral(aplicados > 0 ? 'Revise os campos destacados e tente novamente.' : apiError.message)
    }
  })

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <p className="formulario__nota">
        Campos marcados com <span aria-hidden="true">*</span> são obrigatórios.
      </p>

      {erroGeral && <Alert variant="erro">{erroGeral}</Alert>}

      <FormField
        label="Nome do solicitante"
        required
        hint="Use um nome fictício."
        error={errors.nome_solicitante?.message}
      >
        {(controle) => (
          <input type="text" autoComplete="off" {...controle} {...register('nome_solicitante')} />
        )}
      </FormField>

      <FormField label="Categoria" required error={errors.categoria?.message}>
        {(controle) => (
          <select {...controle} {...register('categoria')}>
            <option value="">Selecione…</option>
            {CATEGORIA_OPCOES.map(({ valor, rotulo }) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField label="Prioridade" required error={errors.prioridade?.message}>
        {(controle) => (
          <select {...controle} {...register('prioridade')}>
            <option value="">Selecione…</option>
            {PRIORIDADE_OPCOES.map(({ valor, rotulo }) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField
        label="Descrição"
        required
        hint="Resumo da solicitação, com até 2000 caracteres."
        error={errors.descricao?.message}
      >
        {(controle) => <textarea rows={5} {...controle} {...register('descricao')} />}
      </FormField>

      {prioridade === 'URGENTE' && (
        <FormField
          label="Justificativa da prioridade"
          required
          hint="Explique por que a solicitação é urgente."
          error={errors.justificativa_prioridade?.message}
        >
          {(controle) => <textarea rows={4} {...controle} {...register('justificativa_prioridade')} />}
        </FormField>
      )}

      <div className="formulario__acoes">
        <button type="submit" className="btn btn--primario" disabled={criar.isPending}>
          {criar.isPending ? 'Enviando…' : 'Criar solicitação'}
        </button>
        <Link className="btn" to="/solicitacoes">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
