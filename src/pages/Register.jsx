import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createAddress, registerUser } from '../api/auth'

const Register = () => {
  const [form, setForm] = useState({
    userName: '',
    phoneNumber: '',
    email: '',
    password: '',
    houseNumber: '',
    area: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    
    
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const addressResponse = await createAddress({
        houseNumber: Number(form.houseNumber),
        // we have used number as everyvalue in html is a string 
        area: form.area,
        city: form.city,
        state: form.state,
        country: form.country,
        pincode: Number(form.pincode),
      })

      const addressId = addressResponse.data.data.addressId

      await registerUser(
        {
          userName: form.userName,
          phoneNumber: Number(form.phoneNumber),
          email: form.email,
          password: form.password,
          role: 'ROLE_USER',
        },
        addressId
      )

      navigate('/login')
    } catch (err) {
      setError('Registration failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <h3>Account</h3>
        <input name="userName" placeholder="Full Name" value={form.userName} onChange={handleChange} required /><br/>
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br/>
        <input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} required /><br/>

        <h3>Address</h3>
        {/* form.email here from is statevaribale cz we are using sinle usestate  and form is storing a obj in it*/}
        <input name="houseNumber" placeholder="House Number" value={form.houseNumber} onChange={handleChange} required /><br/>
        <input name="area" placeholder="Area" value={form.area} onChange={handleChange} required /><br/>
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required /><br/>
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required /><br/>
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required /><br/>
        <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required /><br/>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default Register