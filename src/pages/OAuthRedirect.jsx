import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const OAuthRedirect = () => {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (token) {
      login(token)
      navigate('/books')
    } else {
      navigate('/login', { state: { error: error || 'Google login failed' } })
    }
  }, [])

  return <p>Logging you in...</p>
}

export default OAuthRedirect