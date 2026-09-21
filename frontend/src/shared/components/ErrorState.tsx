interface ErrorStateProps {
  message: string
  title?: string
  onRetry?: () => void
}

export function ErrorState({ message, title = 'Algo deu errado', onRetry }: ErrorStateProps) {
  return (
    <div className="state state--erro" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  )
}
