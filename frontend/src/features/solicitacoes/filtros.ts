import { isCategoria, isPrioridade, isStatus } from './types'
import type { FiltrosSolicitacao } from './types'

export type CampoFiltro = 'status' | 'categoria' | 'prioridade'

/** Lê os filtros da URL, descartando valores inválidos (a API responderia 422 para eles). */
export function lerFiltros(params: URLSearchParams): FiltrosSolicitacao {
  const status = params.get('status')
  const categoria = params.get('categoria')
  const prioridade = params.get('prioridade')
  const pagina = Number(params.get('page'))

  return {
    status: isStatus(status) ? status : undefined,
    categoria: isCategoria(categoria) ? categoria : undefined,
    prioridade: isPrioridade(prioridade) ? prioridade : undefined,
    page: Number.isInteger(pagina) && pagina > 1 ? pagina : 1,
  }
}

export function temFiltrosAtivos(filtros: FiltrosSolicitacao): boolean {
  return Boolean(filtros.status || filtros.categoria || filtros.prioridade)
}

/** Devolve novos parâmetros de URL; valor vazio remove o parâmetro. */
export function atualizarParametros(
  atuais: URLSearchParams,
  mudancas: Partial<Record<CampoFiltro | 'page', string>>,
): URLSearchParams {
  const proximos = new URLSearchParams(atuais)

  for (const [chave, valor] of Object.entries(mudancas)) {
    if (valor) {
      proximos.set(chave, valor)
    } else {
      proximos.delete(chave)
    }
  }

  return proximos
}
