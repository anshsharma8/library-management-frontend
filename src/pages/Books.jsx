import { useState, useEffect } from 'react'
import { getAllBooks, addBook, deleteBook, updateBookPartial, borrowBook, returnBook } from '../api/books'
import { useAuth } from '../context/AuthContext'

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newBook, setNewBook] = useState({ title: '', author: '' })
  const [tab, setTab] = useState('available') // 'available' | 'mine'

  const [editingBookId, setEditingBookId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', author: '' })

  const { user, logout } = useAuth()

  const loadBooks = async () => {
    setLoading(true)
    try {
      const response = await getAllBooks()
      setBooks(response.data.data)
    } catch (err) {
      setError('Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooks()
  }, [])

  const handleAddBook = async (e) => {
    e.preventDefault()
    try {
      await addBook({ title: newBook.title, author: newBook.author, borrowed: false })
      setNewBook({ title: '', author: '' })
      loadBooks()
    } catch (err) {
      setError('Failed to add book')
    }
  }

  const handleDelete = async (bookId) => {
    try {
      await deleteBook(bookId)
      loadBooks()
    } catch (err) {
      setError('Failed to delete book')
    }
  }

  const handleBorrow = async (book) => {
    try {
      await borrowBook(user.userId, book.bookId)
      loadBooks()
    } catch (err) {
      setError('Failed to borrow book — it may already be taken')
    }
  }

  const handleReturn = async (book) => {
    try {
      await returnBook(book.bookId)
      loadBooks()
    } catch (err) {
      setError('Failed to return book')
    }
  }

  const startEdit = (book) => {
    setEditingBookId(book.bookId)
    setEditForm({ title: book.title, author: book.author })
  }

  const cancelEdit = () => {
    setEditingBookId(null)
    setEditForm({ title: '', author: '' })
  }

  const handleSaveEdit = async (bookId) => {
    try {
      await updateBookPartial(bookId, { title: editForm.title, author: editForm.author })
      cancelEdit()
      loadBooks()
    } catch (err) {
      setError('Failed to update book')
    }
  }

  const isAdmin = user?.role === 'ROLE_ADMIN'

  const availableBooks = books.filter((b) => !b.borrowed)
  const myBorrowedBooks = books.filter((b) => b.borrowed && b.user?.userId === user?.userId)
  const visibleBooks = tab === 'available' ? availableBooks : myBorrowedBooks

  const renderRow = (book) => (
    <tr key={book.bookId}>
      {editingBookId === book.bookId ? (
        <>
          <td>
            <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
          </td>
          <td>
            <input value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} />
          </td>
          <td>
            <button onClick={() => handleSaveEdit(book.bookId)}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </td>
        </>
      ) : (
        <>
          <td>{book.title}</td>
          <td>{book.author}</td>
          <td>
            {tab === 'available' && (
              <button onClick={() => handleBorrow(book)}>Borrow</button>
            )}
            {tab === 'mine' && (
              <button onClick={() => handleReturn(book)}>Return</button>
            )}
            {isAdmin && (
              <>
                <button onClick={() => startEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book.bookId)}>Delete</button>
              </>
            )}
          </td>
        </>
      )}
    </tr>
  )

  return (
    <div>
      <h1>Books</h1>

      {isAdmin && (
        <form onSubmit={handleAddBook}>
          <input
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          /><br/>
          <input
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
          /><br/>
          <button type="submit">Add Book</button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={() => setTab('available')} disabled={tab === 'available'}>
          Available Books ({availableBooks.length})
        </button>
        <button onClick={() => setTab('mine')} disabled={tab === 'mine'}>
          My Borrowed Books ({myBorrowedBooks.length})
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleBooks.map(renderRow)}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Books