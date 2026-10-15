import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <EmptyState
      title="Página não encontrada"
      description="O endereço acessado não existe neste aplicativo."
      action={
        <Link to="/" className="font-semibold text-green-800 hover:text-green-950">
          Voltar para a busca
        </Link>
      }
    />
  )
}
