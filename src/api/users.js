import apiClient from './client'

export const getAllUsers = () => {
  return apiClient.get('/user/fetchAll')
}

export const deleteUser = (userId) => {
  return apiClient.delete(`/user/${userId}`)
}