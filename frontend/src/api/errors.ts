import axios from 'axios'

export type FieldErrors = Record<string, string[]>

/** Erro padronizado: o resto da aplicação só lida com este tipo, nunca com AxiosError. */
export class ApiError extends Error {
  status: number | null
  fieldErrors: FieldErrors

  constructor(message: string, status: number | null = null, fieldErrors: FieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

const MENSAGEM_PADRAO = 'Não foi possível concluir a operação. Tente novamente em instantes.'
const MENSAGEM_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'

function isRecord(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function lerErrosDeCampo(valor: unknown): FieldErrors {
  if (!isRecord(valor)) return {}

  const erros: FieldErrors = {}
  for (const [campo, mensagens] of Object.entries(valor)) {
    if (Array.isArray(mensagens)) {
      erros[campo] = mensagens.filter((m): m is string => typeof m === 'string')
    }
  }
  return erros
}

export function toApiError(erro: unknown): ApiError {
  if (erro instanceof ApiError) return erro

  if (axios.isAxiosError(erro)) {
    if (!erro.response) return new ApiError(MENSAGEM_SEM_CONEXAO)

    const { status, data } = erro.response
    const corpo = isRecord(data) ? data : {}
    const mensagem =
      typeof corpo.message === 'string' && corpo.message !== '' ? corpo.message : MENSAGEM_PADRAO

    return new ApiError(mensagem, status, lerErrosDeCampo(corpo.errors))
  }

  return new ApiError(MENSAGEM_PADRAO)
}

export function isNotFound(erro: unknown): boolean {
  return erro instanceof ApiError && erro.status === 404
}
