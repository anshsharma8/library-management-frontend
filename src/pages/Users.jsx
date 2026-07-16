import { useState, useEffect } from 'react'
import { getAllUsers, deleteUser } from '../api/users'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await getAllUsers()
      setUsers(response.data.data)
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

const handleDelete = async (userId) => {
  try {
    await deleteUser(userId)
    loadUsers()
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to delete user')
  }
}

  return (
    <div>
      <h1>Users (Admin)</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId}>
                <td>{u.userName}</td>
                <td>{u.email}</td>
                <td>{u.phoneNumber}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => handleDelete(u.userId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Users