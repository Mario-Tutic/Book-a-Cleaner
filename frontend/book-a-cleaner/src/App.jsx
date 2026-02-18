
import { Routes, Route } from 'react-router'

import { LandingPage } from './pages/landing/LandingPage'
import { Register } from './pages/auth/Register'
import { Login } from './pages/auth/Login'
import { HomePage } from './pages/home/HomePage'
import { OwnerDashboard } from './pages/ownerDashboard/OwnerDashboard'
import { CleanerDashboard } from './pages/cleanerDashboard/cleanerDashboard'
import {ProtectedRoute} from './components/ProtectedRoute'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path='' element={<LandingPage />}></Route>
      <Route path='auth/register' element={<Register />}></Route>
      <Route path='auth/login' element={<Login />}></Route>
      <Route path='home' element={<HomePage />}></Route>
      <Route
        path='owner/dashboard'
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }></Route>
      <Route path='cleaner/dashboard' element={<CleanerDashboard />}></Route>


    </Routes>
  )
}

export default App
