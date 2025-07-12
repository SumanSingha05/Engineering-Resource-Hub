import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { currentUser } = useAuth()

  return currentUser ? <>{children}</> : <Navigate to="/login" />
}

export default PrivateRoute 