import { useState, useEffect } from 'react'
import {
  Typography, Button, Card, CardContent, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, Alert
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import type { Transaction } from '../types/transaction'
import type { Category } from '../types/category'
import { createTransaccion, deleteTransaccion, getTransacciones, updateTransaccion } from '../services/transactionService'
import { getCategorias } from '../services/categoryService'


const Transacciones = () => {
  const [transacciones, setTransacciones] = useState<Transaction[]>([])
  const [categorias, setCategorias] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editando, setEditando] = useState<Transaction | null>(null)
  const [error, setError] = useState('')

  const mes = new Date().getMonth() + 1
  const anio = new Date().getFullYear()

  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    categoryId: ''
  })

  const fetchData = async () => {
    const [trans, cats] = await Promise.all([
      getTransacciones(mes, anio),
      getCategorias()
    ])
    setTransacciones(trans)
    setCategorias(cats)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleOpen = (transaccion?: Transaction) => {
    if (transaccion) {
      setEditando(transaccion)
      setForm({
        amount: transaccion.amount.toString(),
        description: transaccion.description,
        date: transaccion.date.split('T')[0],
        type: transaccion.type,
        categoryId: transaccion.categoryId.toString()
      })
    } else {
      setEditando(null)
      setForm({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        categoryId: ''
      })
    }
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.amount || !form.categoryId) {
      setError('Completa todos los campos')
      return
    }

    const data = {
      Amount: parseFloat(form.amount),
      Description: form.description,
      Date: new Date(form.date).toISOString(),
      Type: form.type,
      CategoryId: parseInt(form.categoryId)
    }

    if (editando) {
      await updateTransaccion(editando.id, data)
    } else {
      await createTransaccion(data)
    }

    handleClose()
    fetchData()
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás segura de eliminar esta transacción?')) {
      await deleteTransaccion(id)
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
        <Typography variant="h5" fontWeight="bold">Transacciones</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Nueva transacción
        </Button>
      </div>

      {transacciones.length === 0 && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent className="text-center py-8">
            <Typography color="text.secondary">No hay transacciones este mes</Typography>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {transacciones.map(t => (
          <Card key={t.id} sx={{ borderRadius: 3 }}>
            <CardContent className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: t.categoryColor }}
                />
                <div>
                  <Typography fontWeight="medium">{t.description || t.categoryName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t.categoryIcon} {t.categoryName} · {new Date(t.date).toLocaleDateString('es')}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Typography
                  fontWeight="bold"
                  color={t.type === 'ingreso' ? 'success.main' : 'error.main'}
                >
                  {t.type === 'ingreso' ? '+' : '-'} Bs. {t.amount.toFixed(2)}
                </Typography>
                <IconButton size="small" onClick={() => handleOpen(t)}><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(t.id)}><DeleteIcon fontSize="small" /></IconButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editando ? 'Editar transacción' : 'Nueva transacción'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4">
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Monto"
            type="number"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            fullWidth
          />
          <TextField
            label="Descripción"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            fullWidth
          />
          <TextField
            label="Fecha"
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
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
            label="Categoría"
            select
            value={form.categoryId}
            onChange={e => setForm({ ...form, categoryId: e.target.value })}
            fullWidth
          >
            {categorias.map(c => (
              <MenuItem key={c.id} value={c.id}>
                {c.icon} {c.name}
              </MenuItem>
            ))}
          </TextField>
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

export default Transacciones