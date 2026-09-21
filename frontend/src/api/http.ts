import axios from 'axios'
import { toApiError } from './errors'

// O proxy do Vite encaminha /api para o Laravel, então não há CORS em desenvolvimento.
export const http = axios.create({
  baseURL: '/api/v1',
  headers: { Accept: 'application/json' },
  timeout: 15_000,
})

http.interceptors.response.use(
  (resposta) => resposta,
  (erro: unknown) => Promise.reject(toApiError(erro)),
)
