import { describe, expect, it } from 'vitest'
import { paraPayload, solicitacaoSchema } from './schema'

// Estas regras espelham o StoreSolicitacaoRequest do backend (veja
// backend/tests/Unit/StatusTransicaoTest.php para o equivalente do fluxo de status).
// O objetivo aqui é o comportamento de negócio, não apenas cobrir linhas.

describe('solicitacaoSchema', () => {
  const valido = {
    nome_solicitante: 'Maria Teste',
    categoria: 'CONSULTA' as const,
    prioridade: 'BAIXA' as const,
    descricao: 'Consulta de rotina',
    justificativa_prioridade: '',
  }

  it('aceita uma solicitação válida com prioridade comum', () => {
    const resultado = solicitacaoSchema.safeParse(valido)
    expect(resultado.success).toBe(true)
  })

  it('recusa quando faltam os campos obrigatórios', () => {
    const resultado = solicitacaoSchema.safeParse({
      nome_solicitante: '',
      categoria: '',
      prioridade: '',
      descricao: '',
      justificativa_prioridade: '',
    })

    expect(resultado.success).toBe(false)
    if (resultado.success) return
    const campos = resultado.error.issues.map((problema) => problema.path.join('.'))
    expect(campos).toEqual(
      expect.arrayContaining(['nome_solicitante', 'categoria', 'prioridade', 'descricao']),
    )
  })

  it('exige justificativa quando a prioridade é URGENTE', () => {
    const resultado = solicitacaoSchema.safeParse({ ...valido, prioridade: 'URGENTE' })

    expect(resultado.success).toBe(false)
    if (resultado.success) return
    expect(resultado.error.issues[0].path).toEqual(['justificativa_prioridade'])
  })

  it('não exige justificativa preenchida só com espaços', () => {
    const resultado = solicitacaoSchema.safeParse({
      ...valido,
      prioridade: 'URGENTE',
      justificativa_prioridade: '   ',
    })

    expect(resultado.success).toBe(false)
  })

  it('aceita URGENTE quando a justificativa está preenchida', () => {
    const resultado = solicitacaoSchema.safeParse({
      ...valido,
      prioridade: 'URGENTE',
      justificativa_prioridade: 'Paciente com risco',
    })

    expect(resultado.success).toBe(true)
  })

  it('recusa nome e descrição acima do limite de caracteres', () => {
    const resultado = solicitacaoSchema.safeParse({
      ...valido,
      nome_solicitante: 'a'.repeat(151),
      descricao: 'b'.repeat(2001),
    })

    expect(resultado.success).toBe(false)
    if (resultado.success) return
    const campos = resultado.error.issues.map((problema) => problema.path.join('.'))
    expect(campos).toEqual(expect.arrayContaining(['nome_solicitante', 'descricao']))
  })
})

describe('paraPayload', () => {
  it('não envia justificativa quando a prioridade não é URGENTE', () => {
    const payload = paraPayload({
      nome_solicitante: 'Maria Teste',
      categoria: 'CONSULTA',
      prioridade: 'BAIXA',
      descricao: 'Consulta de rotina',
      justificativa_prioridade: '',
    })

    expect(payload).not.toHaveProperty('justificativa_prioridade')
  })

  it('envia a justificativa quando a prioridade é URGENTE', () => {
    const payload = paraPayload({
      nome_solicitante: 'Maria Teste',
      categoria: 'EXAME',
      prioridade: 'URGENTE',
      descricao: 'Exame urgente',
      justificativa_prioridade: 'Paciente com risco',
    })

    expect(payload.justificativa_prioridade).toBe('Paciente com risco')
  })
})
