interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Carregando…' }: LoadingStateProps) {
  return (
    <div className="state" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
