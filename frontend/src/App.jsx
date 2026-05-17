import { useState } from 'react'
import './App.css'

import React from 'react'
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
    </Routes>
  )
}

function Home() {
  return (
    <>
      <h1>Music Bridge</h1>
      <div className="icon">
        yippee<p></p>
        We make a musik.<br></br>
        <a>
          <img src="src/res/musicBridgeIdeaIcon.jpg"/>
        </a>
      </div>
      <br></br>
      <div className="cred_table">        
        <button onClick={event => window.location.href='/signUp'}>Sign Up</button>
        <button onClick={event => window.location.href='/login' }>Log In</button>
      </div>
    </>
  )
}

function SignUp(){
  return <h1>Sign up</h1>
}

function Login(){
  return <h1>Login</h1>
}

export default App
