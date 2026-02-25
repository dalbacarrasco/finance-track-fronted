import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TextField, Button, Alert, CircularProgress } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { register } from '../services/authService'

const Register = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUsuario } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await register(nombre, email, password)

    if (res.token) {
      loginUsuario(res)
      navigate('/')
    } else {
      setError('No se pudo crear la cuenta, el email ya está registrado')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">FinTrack</h1>
        <p className="text-center text-gray-500 mb-6">Crea tu cuenta</p>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Nombre"
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>
        </form>

        <p className="text-center text-gray-500 mt-4 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register