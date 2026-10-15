import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { AdminLayout } from '../features/admin/pages/AdminLayout'
import { BuyerFormPage } from '../features/admin/pages/BuyerFormPage'
import { BuyerOffersPage } from '../features/admin/pages/BuyerOffersPage'
import { BuyersAdminPage } from '../features/admin/pages/BuyersAdminPage'
import { ProductsAdminPage } from '../features/admin/pages/ProductsAdminPage'
import { BuyerDetailsPage } from '../features/buyers/pages/BuyerDetailsPage'
import { ResultsPage } from '../features/buyers/pages/ResultsPage'
import { SearchPage } from '../features/buyers/pages/SearchPage'
import { NotFoundPage } from './NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <SearchPage /> },
      { path: '/compradores', element: <ResultsPage /> },
      { path: '/compradores/:id', element: <BuyerDetailsPage /> },
      {
        path: '/gestao',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="compradores" replace /> },
          { path: 'compradores', element: <BuyersAdminPage /> },
          { path: 'compradores/novo', element: <BuyerFormPage /> },
          { path: 'compradores/:id/editar', element: <BuyerFormPage /> },
          { path: 'compradores/:id/ofertas', element: <BuyerOffersPage /> },
          { path: 'produtos', element: <ProductsAdminPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
