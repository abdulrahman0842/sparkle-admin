import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './routes/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Collections from './pages/Collections'
import ProductsList from './components/ProductsList'
import ProductForm from './components/ProductForm'
import Variant from './pages/Variant'



function App() {
  return (

    <Routes>

      <Route path='/login' element={<Login />} />
      <Route path='/' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} >
        <Route index element={<h3 className='d-flex  justify-content-center'>Welcome to Sparkle Admin</h3>}/>
        <Route path="/products" element={<Products />} >
          <Route index element={<ProductsList />} />
          <Route path="add" element={<ProductForm />} />
          <Route path="variant/:productId" element={<Variant />} />
          <Route path="edit/:id" element={<ProductForm />} />
          
        </Route>

        <Route path="categories" element={<Categories />} />
        <Route path="collections" element={<Collections />} />
      </Route>

    </Routes>

  )
}

export default App
