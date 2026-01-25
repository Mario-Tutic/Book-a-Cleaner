
import {Routes,Route} from 'react-router'

import { LandingPage } from './pages/landing/LandingPage'
import { Register } from './pages/auth/Register'
import {Login} from './pages/auth/Login' 

import './App.css'

function App() {

  return (
    <Routes>
      <Route path='' element={<LandingPage/>}></Route>
      <Route path='auth/register' element={<Register/>}></Route>
      <Route path='auth/login' element={<Login/>}></Route>


    </Routes>
  )
}

export default App
