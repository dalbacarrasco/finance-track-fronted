import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, CircularProgress } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getResumen, getGastosPorCategoria } from '../services/dashboardService'
import type { Resume } from '../types/resume'
import type { SpendingByCategory } from '../types/spendingByCategory'


const Dashboard = () => {
  const [resumen, setResumen] = useState<Resume | null>(null)
  const [gastos, setGastos] = useState<SpendingByCategory[]>([])
  const [loading, setLoading] = useState(true)

  const mes = new Date().getMonth() + 1
  const año = new Date().getFullYear()

  useEffect(() => {
    const fetchData = async () => {
      const [resumenData, gastosData] = await Promise.all([
        getResumen(mes, año),
        getGastosPorCategoria(mes, año)
      ])
      setResumen(resumenData)
      setGastos(gastosData)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <CircularProgress />
    </div>
  )

  return (
    <div>
      <Typography variant="h5" className="mb-6 font-bold text-gray-800" fontWeight="bold">
        Resumen de {new Date().toLocaleString('es', { month: 'long', year: 'numeric' })}
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Ingresos</Typography>
            <Typography variant="h5" color="success.main" fontWeight="bold">
              Bs. {resumen?.totalIncomings.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Gastos</Typography>
            <Typography variant="h5" color="error.main" fontWeight="bold">
              Bs. {resumen?.totalExpenses.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, bgcolor: resumen && resumen.balance >= 0 ? 'success.50' : 'error.50' }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Balance</Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={resumen && resumen.balance >= 0 ? 'success.main' : 'error.main'}
            >
              Bs. {resumen?.balance.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {gastos.length > 0 && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" className="mb-4" fontWeight="bold">
              Gastos por categoría
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gastos}
                  dataKey="total"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {gastos.map((entry, index) => (
                    <Cell key={index} fill={entry.categoryColor} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Bs. ${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {gastos.length === 0 && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent className="text-center py-8">
            <Typography color="text.secondary">
              No hay gastos registrados este mes
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard