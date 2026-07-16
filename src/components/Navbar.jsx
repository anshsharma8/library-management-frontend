import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav style={{ display: 'flex', gap: '16px', padding: '12px', borderBottom: '1px solid #ccc' }}>
      <Link to="/books">Books</Link>
      <Link to="/libraries">Libraries</Link>
      
      {user.role === 'ROLE_ADMIN' && <Link to="/users">Users</Link>}
      <span style={{ marginLeft: 'auto' }}>
        {user.sub} ({user.role}) — <button onClick={handleLogout}>Logout</button>
      </span>
    </nav>
  )
}

export default Navbar