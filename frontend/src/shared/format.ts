const formatadorDataHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatarDataHora(iso: string): string {
  const data = new Date(iso)
  return Number.isNaN(data.getTime()) ? iso : formatadorDataHora.format(data)
}
