import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import TaskList from '@/pages/TaskList'  // Import the TaskList component
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="tasks" element={<TaskList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App