import { useState } from 'react'
import './App.css'

import React from 'react'
import { Route, Routes } from "react-router-dom"

// Login
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

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
  return (
  <>
    <h1>Sign up</h1>
  </>
  )
}


// import 
// export const login = async (email, password) => {
//   try {
//     const response = await axios.post(`${API_URL}/users`, { email, password });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 3) newErrors.password = 'Password must be at least 3 characters';
    return newErrors;
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      console.log('Login attempted with:', { email, password });
      // Here you would typically send a request to your server
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='login-form-container'>
        <h2 className="login-title">Login</h2>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="login-box" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control className='login-text-box'
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="login-box" controlId="formBasicPassword">
            <Form.Label >Password</Form.Label>
            <Form.Control className='login-text-box'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="login-button">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App
