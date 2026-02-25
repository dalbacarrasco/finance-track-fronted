import { useState, useEffect } from 'react'
import {
  Typography, Button, Card, CardContent, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, Alert
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import type { Category } from '../types/category'
import { createCategoria, deleteCategoria, getCategorias, updateCategoria } from '../services/categoryService'


const Categorias = () => {
  const [categorias, setCategorias] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editando, setEditando] = useState<Category | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    type: 'expense',
    color: '#3b82f6',
    icon: ''
  })

  const fetchData = async () => {
    const data = await getCategorias()
    setCategorias(data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleOpen = (categoria?: Category) => {
    if (categoria) {
      setEditando(categoria)
      setForm({
        name: categoria.name,
        type: categoria.type,
        color: categoria.color,
        icon: categoria.icon
      })
    } else {
      setEditando(null)
      setForm({ name: '', type: 'expense', color: '#3b82f6', icon: '' })
    }
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.name) {
      setError('El nombre es obligatorio')
      return
    }

    const data = {
      Name: form.name,
      Type: form.type,
      Color: form.color,
      Icon: form.icon
    }

    if (editando) {
      await updateCategoria(editando.id, data)
    } else {
      await createCategoria(data)
    }

    handleClose()
    fetchData()
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás segura de eliminar esta categoría?')) {
      await deleteCategoria(id)
      fetchData()
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <CircularProgress />
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="bold">Categorías</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Nueva categoría
        </Button>
      </div>

      {categorias.length === 0 && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent className="text-center py-8">
            <Typography color="text.secondary">No hay categorías aún</Typography>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map(c => (
          <Card key={c.id} sx={{ borderRadius: 3 }}>
            <CardContent className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <div>
                  <Typography fontWeight="medium">{c.icon} {c.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {c.type === 'income' ? 'Ingreso' : 'Gasto'}
                  </Typography>
                </div>
              </div>
              <div>
                <IconButton size="small" onClick={() => handleOpen(c)}><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(c.id)}><DeleteIcon fontSize="small" /></IconButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editando ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4">
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nombre"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Tipo"
            select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            fullWidth
          >
            <MenuItem value="ingreso">Ingreso</MenuItem>
            <MenuItem value="gasto">Gasto</MenuItem>
          </TextField>
          <TextField
            label="Color"
            type="color"
            value={form.color}
            onChange={e => setForm({ ...form, color: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Ícono (emoji)"
            value={form.icon}
            onChange={e => setForm({ ...form, icon: e.target.value })}
            fullWidth
            placeholder="🍔"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editando ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Categorias