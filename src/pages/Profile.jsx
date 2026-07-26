import { useState, useEffect } from 'react'
import { getUserById, updateUserPartial } from '../api/users'
import { updateAddressPartial } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [userForm, setUserForm] = useState({ userName: '', phoneNumber: '' })
  const [addressForm, setAddressForm] = useState({})
  const [addressId, setAddressId] = useState(null)

  const loadProfile = async () => {
    setLoading(true)
    try {
      const response = await getUserById(user.userId)
      const data = response.data.data

      setUserForm({ userName: data.userName, phoneNumber: data.phoneNumber })
      setAddressForm({ ...data.address })
      setAddressId(data.address?.addressId)
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleSaveUser = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await updateUserPartial(user.userId, {
        ...userForm,
        phoneNumber: Number(userForm.phoneNumber),
      })
      setSuccess('Profile details updated')
    } catch (err) {
      setError('Failed to update profile details')
    }
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await updateAddressPartial(addressId, {
        ...addressForm,
        houseNumber: Number(addressForm.houseNumber),
        pincode: Number(addressForm.pincode),
      })
      setSuccess('Address updated')
    } catch (err) {
      setError('Failed to update address')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>My Profile</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSaveUser}>
        <h3>Account Details</h3>
        <input placeholder="Name" value={userForm.userName}
          onChange={(e) => setUserForm({ ...userForm, userName: e.target.value })} /><br/>
        <input placeholder="Phone Number" value={userForm.phoneNumber}
          onChange={(e) => setUserForm({ ...userForm, phoneNumber: e.target.value })} /><br/>
        <button type="submit">Save Account Details</button>
      </form>

      <form onSubmit={handleSaveAddress}>
        <h3>Address</h3>
        <input placeholder="House Number" value={addressForm.houseNumber || ''}
          onChange={(e) => setAddressForm({ ...addressForm, houseNumber: e.target.value })} /><br/>
        <input placeholder="Area" value={addressForm.area || ''}
          onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })} /><br/>
        <input placeholder="City" value={addressForm.city || ''}
          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} /><br/>
        <input placeholder="State" value={addressForm.state || ''}
          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} /><br/>
        <input placeholder="Country" value={addressForm.country || ''}
          onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} /><br/>
        <input placeholder="Pincode" value={addressForm.pincode || ''}
          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} /><br/>
        <button type="submit">Save Address</button>
      </form>
    </div>
  )
}

export default Profile