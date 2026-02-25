import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { usuario, logoutUsuario } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUsuario()
    navigate('/login')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          FinancesTrack
        </Typography>
        <Box className="flex gap-4 items-center">
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/transactions">Transacciones</Button>
          <Button color="inherit" component={Link} to="/categories">Categorías</Button>
          <Typography variant="body2" sx={{ mx: 1 }}>
            Hola, {usuario?.name}
          </Typography>
          <Button color="inherit" variant="outlined" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar