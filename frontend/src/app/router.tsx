import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { RequireAuth } from '../features/auth/components/RequireAuth'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { ChangePasswordPage } from '../features/auth/pages/ChangePasswordPage'
import { AdminLayout } from '../features/admin/pages/AdminLayout'
import { BuyerAreaPage } from '../features/admin/pages/BuyerAreaPage'
import { BuyersAdminPage } from '../features/admin/pages/BuyersAdminPage'
import { GestaoIndex } from '../features/admin/pages/GestaoIndex'
import { ProductsAdminPage } from '../features/admin/pages/ProductsAdminPage'
import { UsersAdminPage } from '../features/admin/pages/UsersAdminPage'
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
      { path: '/login', element: <LoginPage /> },
      {
        path: '/trocar-senha',
        element: <RequireAuth allowPasswordChange />,
        children: [{ index: true, element: <ChangePasswordPage /> }],
      },
      {
        path: '/gestao',
        element: <RequireAuth />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <GestaoIndex /> },
              {
                path: 'minha-area',
                element: <RequireAuth role="BUYER" />,
                children: [{ index: true, element: <BuyerAreaPage /> }],
              },
              {
                element: <RequireAuth role="ADMIN" />,
                children: [
                  { path: 'compradores', element: <BuyersAdminPage /> },
                  { path: 'produtos', element: <ProductsAdminPage /> },
                  { path: 'usuarios', element: <UsersAdminPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
