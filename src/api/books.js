import apiClient from "./client"

export const getAllBooks=()=>{
    return apiClient.get('/book/fetchAll')
}

export const addBook=(bookData)=>{
    return apiClient.post('/book',bookData)   
}


export const deleteBook = (bookId) => {
  return apiClient.delete(`/book/${bookId}`)
}

export const updateBookPartial = (bookId, bookData) => {
  return apiClient.patch(`/book/${bookId}`, bookData)
}

export const borrowBook = (userId, bookId) => {
  return apiClient.put(`/user/borrow/${userId}/${bookId}`)
}

export const returnBook = (bookId) => {
  return apiClient.put(`/user/return/${bookId}`)
}