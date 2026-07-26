import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center'}}>
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/books">Go back to Books</Link>
    </div>
  )
}

export default NotFound