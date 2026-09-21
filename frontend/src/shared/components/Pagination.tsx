interface PaginationProps {
  paginaAtual: number
  ultimaPagina: number
  onChange: (pagina: number) => void
}

export function Pagination({ paginaAtual, ultimaPagina, onChange }: PaginationProps) {
  if (ultimaPagina <= 1) return null

  return (
    <nav className="paginacao" aria-label="Paginação">
      <button
        type="button"
        className="btn"
        onClick={() => onChange(paginaAtual - 1)}
        disabled={paginaAtual <= 1}
      >
        Anterior
      </button>
      <span>
        Página {paginaAtual} de {ultimaPagina}
      </span>
      <button
        type="button"
        className="btn"
        onClick={() => onChange(paginaAtual + 1)}
        disabled={paginaAtual >= ultimaPagina}
      >
        Próxima
      </button>
    </nav>
  )
}
