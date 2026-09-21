import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

export function Layout() {
  const { pathname } = useLocation()
  const principal = useRef<HTMLElement>(null)
  const caminhoAnterior = useRef(pathname)

  // Ao trocar de página, leva o foco para o conteúdo: quem usa teclado ou leitor de tela
  // percebe a mudança, já que a navegação em SPA não recarrega a página.
  // Comparar com o caminho anterior evita mexer no foco no primeiro carregamento.
  useEffect(() => {
    if (caminhoAnterior.current === pathname) return
    caminhoAnterior.current = pathname
    principal.current?.focus()
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <header className="cabecalho">
        <div className="container cabecalho__interno">
          <span className="cabecalho__marca">Solicitações</span>
          <nav aria-label="Principal">
            <ul className="menu">
              <li>
                <NavLink to="/" end>
                  Início
                </NavLink>
              </li>
              <li>
                <NavLink to="/solicitacoes" end>
                  Solicitações
                </NavLink>
              </li>
              <li>
                <NavLink to="/solicitacoes/nova">Nova solicitação</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="conteudo" ref={principal} tabIndex={-1} className="container principal">
        <Outlet />
      </main>
    </>
  )
}
