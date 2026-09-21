import { Link } from 'react-router-dom'
import { EmptyState } from '../../../shared/components/EmptyState'
import { usePageTitle } from '../../../shared/hooks/usePageTitle'

export function NaoEncontradaPage() {
  usePageTitle('Página não encontrada')

  return (
    <EmptyState title="Página não encontrada" description="O endereço acessado não existe ou foi removido.">
      <Link className="btn btn--primario" to="/">
        Voltar ao início
      </Link>
    </EmptyState>
  )
}
