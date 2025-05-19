import React from 'react'
import RegistrationForm from './comps/Register'
import LoginForm from './comps/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFound from './comps/NotFound'
import { useState } from 'react'
import Dashboard from './comps/Dashboard'
import { useEffect } from 'react'

const App = () => {
  const [islog, setIslog] = useState(localStorage.getItem("uname") ? true : false)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={islog ? <Dashboard /> : <LoginForm />} />
          <Route path='/register' element={<RegistrationForm />} />
          <Route path='/dashboard' element={islog ? <Dashboard /> : <LoginForm />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
