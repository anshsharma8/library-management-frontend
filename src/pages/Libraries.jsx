import { useState, useEffect } from 'react'
import {
  getAllLibraries,
  createLibrary,
  deleteLibrary,
  getBooksInLibrary,
  addBookToLibrary,
  removeBookFromLibrary,
} from '../api/libraries'
import { getAllBooks } from '../api/books'
import { createAddress } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const Libraries = () => {
  const [libraries, setLibraries] = useState([])
  const [allBooks, setAllBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedLibraryId, setSelectedLibraryId] = useState(null)
  const [libraryBooks, setLibraryBooks] = useState([])
  const [selectedBookToAdd, setSelectedBookToAdd] = useState('')

  const [newLibrary, setNewLibrary] = useState({
    libraryName: '',
    phoneNumber: '',
    houseNumber: '',
    area: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  })

  const { user } = useAuth()

  const loadLibraries = async () => {
    setLoading(true)
    try {
      const response = await getAllLibraries()
      setLibraries(response.data.data)
    } catch (err) {
      setError('Failed to load libraries')
    } finally {
      setLoading(false)
    }
  }

  const loadAllBooks = async () => {
    try {
      const response = await getAllBooks()
      setAllBooks(response.data.data)
    } catch (err) {
      // ignore
    }
  }

  useEffect(() => {
    loadLibraries()
    loadAllBooks()
  }, [])

  const handleCreateLibrary = async (e) => {
    e.preventDefault()
    try {
      const addressResponse = await createAddress({
        houseNumber: Number(newLibrary.houseNumber),
        area: newLibrary.area,
        city: newLibrary.city,
        state: newLibrary.state,
        country: newLibrary.country,
        pincode: Number(newLibrary.pincode),
      })
      const addressId = addressResponse.data.data.addressId

      await createLibrary(
        {
          libraryName: newLibrary.libraryName,
          phoneNumber: Number(newLibrary.phoneNumber),
        },
        addressId
      )

      setNewLibrary({
        libraryName: '', phoneNumber: '', houseNumber: '', area: '',
        city: '', state: '', country: '', pincode: '',
      })
      loadLibraries()
    } catch (err) {
      setError('Failed to create library')
    }
  }

  const handleDelete = async (libraryId) => {
    try {
      await deleteLibrary(libraryId)
      loadLibraries()
    } catch (err) {
      setError('Failed to delete library')
    }
  }

  const handleViewBooks = async (libraryId) => {
    setSelectedLibraryId(libraryId)
    setSelectedBookToAdd('')
    try {
      const response = await getBooksInLibrary(libraryId)
      setLibraryBooks(response.data.data)
    } catch (err) {
      setLibraryBooks([])
    }
  }

  const handleConfirmAddBook = async () => {
    if (!selectedBookToAdd) return
    try {
      await addBookToLibrary(selectedLibraryId, Number(selectedBookToAdd))
      setSelectedBookToAdd('')
      handleViewBooks(selectedLibraryId)
    } catch (err) {
      setError('Failed to add book to library')
    }
  }

  const handleRemoveBook = async (bookId) => {
    try {
      await removeBookFromLibrary(selectedLibraryId, bookId)
      handleViewBooks(selectedLibraryId)
    } catch (err) {
      setError('Failed to remove book from library')
    }
  }

  return (
    <div>
      <h1>Libraries</h1>

      {user?.role === 'ROLE_ADMIN' && (
        <form onSubmit={handleCreateLibrary}>
          <h3>New Library</h3>
          <input placeholder="Library Name" value={newLibrary.libraryName}
            onChange={(e) => setNewLibrary({ ...newLibrary, libraryName: e.target.value })} required /><br/>
          <input placeholder="Phone Number" value={newLibrary.phoneNumber}
            onChange={(e) => setNewLibrary({ ...newLibrary, phoneNumber: e.target.value })} required /><br/>
          <input placeholder="House Number" value={newLibrary.houseNumber}
            onChange={(e) => setNewLibrary({ ...newLibrary, houseNumber: e.target.value })} required /><br/>
          <input placeholder="Area" value={newLibrary.area}
            onChange={(e) => setNewLibrary({ ...newLibrary, area: e.target.value })} required /><br/>
          <input placeholder="City" value={newLibrary.city}
            onChange={(e) => setNewLibrary({ ...newLibrary, city: e.target.value })} required /><br/>
          <input placeholder="State" value={newLibrary.state}
            onChange={(e) => setNewLibrary({ ...newLibrary, state: e.target.value })} required /><br/>
          <input placeholder="Country" value={newLibrary.country}
            onChange={(e) => setNewLibrary({ ...newLibrary, country: e.target.value })} required /><br/>
          <input placeholder="Pincode" value={newLibrary.pincode}
            onChange={(e) => setNewLibrary({ ...newLibrary, pincode: e.target.value })} required /><br/>
          <button type="submit">Create Library</button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {libraries.map((lib) => (
              <tr key={lib.libraryId}>
                <td>{lib.libraryName}</td>
                <td>{lib.phoneNumber}</td>
                <td>
                  <button onClick={() => handleViewBooks(lib.libraryId)}>View Books</button>
                  {user?.role === 'ROLE_ADMIN' && (
                    <button onClick={() => handleDelete(lib.libraryId)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedLibraryId && (
        <div>
          <h3>Books in Library #{selectedLibraryId}</h3>
          <ul>
            {libraryBooks.map((book) => (
              <li key={book.bookId}>
                {book.title} — {book.author}
                {user?.role === 'ROLE_ADMIN' && (
                  <button onClick={() => handleRemoveBook(book.bookId)}>Remove</button>
                )}
              </li>
            ))}
          </ul>

          {user?.role === 'ROLE_ADMIN' && (
            <div>
              <h4>Add a book to this library</h4>
              <select
                value={selectedBookToAdd}
                onChange={(e) => setSelectedBookToAdd(e.target.value)}
              >
                <option value="" disabled>Select a book</option>
                {allBooks.map((book) => (
                  <option key={book.bookId} value={book.bookId}>{book.title}</option>
                ))}
              </select>
              <button onClick={handleConfirmAddBook} disabled={!selectedBookToAdd}>Add</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Libraries