import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm leading-relaxed text-stone-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
          Cancelar
        </Button>
        <Button type="button" variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy}>
          {busy ? 'Aguarde...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
