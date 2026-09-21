import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './app/Layout'
import { queryClient } from './app/queryClient'
import { DashboardPage } from './features/solicitacoes/pages/DashboardPage'
import { DetalheSolicitacaoPage } from './features/solicitacoes/pages/DetalheSolicitacaoPage'
import { ListaSolicitacoesPage } from './features/solicitacoes/pages/ListaSolicitacoesPage'
import { NaoEncontradaPage } from './features/solicitacoes/pages/NaoEncontradaPage'
import { NovaSolicitacaoPage } from './features/solicitacoes/pages/NovaSolicitacaoPage'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="solicitacoes" element={<ListaSolicitacoesPage />} />
            <Route path="solicitacoes/nova" element={<NovaSolicitacaoPage />} />
            <Route path="solicitacoes/:id" element={<DetalheSolicitacaoPage />} />
            <Route path="*" element={<NaoEncontradaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
