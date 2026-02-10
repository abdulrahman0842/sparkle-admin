import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import ProtectedRoute from './routes/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Collections from './pages/Collections'
import AddProductForm from './components/AddProduct'
import ProductsList from './components/ProductsList'
import EditProducts from './components/EditProducts'



function App() {
  return (

    <Routes>

      <Route path='/login' element={<Login />} />
      <Route path='/' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} >
        <Route path="/products" element={<Products />} >
          <Route index element={<ProductsList />} />
          <Route path="add-products" element={<AddProductForm />} />
          <Route path="edit-products" element={<EditProducts />} />
        </Route>

        <Route path="categories" element={<Categories />} />
        <Route path="collections" element={<Collections />} />
      </Route>

    </Routes>

  )
}

export default App
