import { z } from 'zod'
import { CATEGORIAS, PRIORIDADES } from './types'
import type { NovaSolicitacao } from './types'

function justificativaPreenchida(valor: unknown): boolean {
  return typeof valor === 'string' && valor.trim() !== ''
}

// Espelha as regras do backend (StoreSolicitacaoRequest) para avisar o erro antes do envio.
// A API continua sendo a autoridade: se ela recusar, o formulário mostra a mensagem dela.
export const solicitacaoSchema = z
  .object({
    nome_solicitante: z
      .string()
      .trim()
      .min(1, 'Informe o nome do solicitante.')
      .max(150, 'O nome deve ter no máximo 150 caracteres.'),
    categoria: z.enum(CATEGORIAS, { error: 'Selecione uma categoria.' }),
    prioridade: z.enum(PRIORIDADES, { error: 'Selecione uma prioridade.' }),
    descricao: z
      .string()
      .trim()
      .min(1, 'Descreva a solicitação.')
      .max(2000, 'A descrição deve ter no máximo 2000 caracteres.'),
    justificativa_prioridade: z
      .string()
      .trim()
      .max(2000, 'A justificativa deve ter no máximo 2000 caracteres.'),
  })
  .refine(
    (valores) =>
      valores.prioridade !== 'URGENTE' || justificativaPreenchida(valores.justificativa_prioridade),
    {
      error: 'Informe a justificativa: ela é obrigatória para prioridade urgente.',
      path: ['justificativa_prioridade'],
      // Por padrão o Zod pula regras entre campos se algum campo já falhou. Aqui a regra roda sempre,
      // para o formulário mostrar todos os erros de uma vez.
      when: () => true,
    },
  )

export type SolicitacaoFormValues = z.infer<typeof solicitacaoSchema>

export function paraPayload(valores: SolicitacaoFormValues): NovaSolicitacao {
  return {
    nome_solicitante: valores.nome_solicitante,
    categoria: valores.categoria,
    prioridade: valores.prioridade,
    descricao: valores.descricao,
    // A justificativa só é enviada quando faz sentido (prioridade urgente).
    ...(valores.prioridade === 'URGENTE'
      ? { justificativa_prioridade: valores.justificativa_prioridade }
      : {}),
  }
}
