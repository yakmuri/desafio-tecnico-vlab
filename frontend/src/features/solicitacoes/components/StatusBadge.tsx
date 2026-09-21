import { STATUS_LABEL } from '../labels'
import type { Status } from '../types'

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{STATUS_LABEL[status]}</span>
}
