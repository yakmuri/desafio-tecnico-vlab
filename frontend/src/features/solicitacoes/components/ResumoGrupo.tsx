import { useId } from 'react'
import { Link } from 'react-router-dom'

interface ItemResumo {
  rotulo: string
  quantidade: number
  destino: string
}

interface ResumoGrupoProps {
  titulo: string
  total: number
  itens: ItemResumo[]
}

export function ResumoGrupo({ titulo, total, itens }: ResumoGrupoProps) {
  const tituloId = useId()

  return (
    <section aria-labelledby={tituloId} className="resumo">
      <h2 id={tituloId}>{titulo}</h2>
      <ul className="resumo__lista">
        {itens.map(({ rotulo, quantidade, destino }) => (
          <li key={rotulo}>
            <Link to={destino} className="resumo__cartao">
              <span className="resumo__rotulo">{rotulo}</span>
              <span className="resumo__numero">{quantidade}</span>
              <span className="resumo__barra" aria-hidden="true">
                <span style={{ width: `${total > 0 ? (quantidade / total) * 100 : 0}%` }} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
