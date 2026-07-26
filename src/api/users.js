import apiClient from './client'

export const getAllUsers = () => {
  return apiClient.get('/user/fetchAll')
}

export const deleteUser = (userId) => {
  return apiClient.delete(`/user/${userId}`)
}
export const getUserById = (userId) => {
  return apiClient.get(`/user/${userId}`)
}

export const updateUserPartial = (userId, userData) => {
  return apiClient.patch(`/user/${userId}`, userData)
}