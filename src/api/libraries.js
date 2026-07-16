import apiClient from './client'

export const getAllLibraries = () => {
  return apiClient.get('/library/fetchAll')
}

export const createLibrary = (libraryData, addressId) => {
  return apiClient.post(`/library/${addressId}`, libraryData)
}

export const deleteLibrary = (libraryId) => {
  return apiClient.delete(`/library/${libraryId}`)
}

export const getBooksInLibrary = (libraryId) => {
  return apiClient.get(`/library/displayBooks/${libraryId}`)
}

export const addBookToLibrary = (libraryId, bookId) => {
  return apiClient.put(`/library/${libraryId}/${bookId}`)
}

export const removeBookFromLibrary = (libraryId, bookId) => {
  return apiClient.delete(`/library/${libraryId}/${bookId}`)
}