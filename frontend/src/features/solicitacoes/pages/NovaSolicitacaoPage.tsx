import { PageHeader } from '../../../shared/components/PageHeader'
import { usePageTitle } from '../../../shared/hooks/usePageTitle'
import { SolicitacaoForm } from '../components/SolicitacaoForm'

export function NovaSolicitacaoPage() {
  usePageTitle('Nova solicitação')

  return (
    <>
      <PageHeader titulo="Nova solicitação" />
      <SolicitacaoForm />
    </>
  )
}
