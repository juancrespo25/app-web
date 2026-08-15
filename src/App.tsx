import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { TokenExpirationWarning } from '@/components/TokenExpirationWarning'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <TokenExpirationWarning />
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
