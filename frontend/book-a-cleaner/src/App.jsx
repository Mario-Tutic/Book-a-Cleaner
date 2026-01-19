
import {Routes,Route} from 'react-router'

import { LandingPage } from './pages/landing/LandingPage'

import './App.css'

function App() {

  return (
    <Routes>
      <Route path='' element={<LandingPage/>}></Route>

    </Routes>
  )
}

export default App
