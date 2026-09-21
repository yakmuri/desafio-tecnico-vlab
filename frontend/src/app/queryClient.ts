import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../api/errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Erro 4xx (ex.: 404) não melhora ao repetir; falhas de rede e 5xx ganham até 2 novas tentativas.
      retry: (tentativas, erro) => {
        const erroDoCliente = erro instanceof ApiError && erro.status !== null && erro.status < 500
        return !erroDoCliente && tentativas < 2
      },
    },
  },
})
