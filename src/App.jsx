import { useState } from 'react'
import { useEffect } from 'react'
import { supabase } from './services/supabaseClient'
import Login from './components/Login'
import './App.css'
import AddProductForm from './components/AddProduct'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login onAuthSuccess={() => { }} />
  }

  return (
    <div className="container-fluid bg-light">

      <nav className="w-100 bg-light d-flex justify-content-evenly align-items-center mb-4">
        <h1 className="">Sparkle & Loop</h1>
        <div className="">
          Welcome, <strong>{user.email}</strong>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-danger h-100"
        >
          Logout
        </button>
      </nav>

      <div className='w-100 d-flex gap-3 justify-content-center'>
        <button className='btn btn-secondary'>Add Product</button>
        <button className='btn btn-warning'>Edit Product</button>
        <button className='btn btn-danger'>Delete Product</button>
        <button className='btn btn-primary'>View Products</button>
      </div>

      <AddProductForm />

    </div>
  )
}

export default App
