import { useState } from 'react'
import './App.css'

import React from 'react'
import { Route, Routes } from "react-router-dom"

// Login
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
// import Local from 'passport-local';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 3) newErrors.password = 'Password must be at least 3 characters';

    if (!nickname) newErrors.nickname = 'Nickname is required';

    return newErrors;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    } 
    try {
      const res = await fetch("/api/auth/signUp/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nickname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ server: data.error });
      } else {
        window.location.href = `/${nickname}/dashboard` // where it redirects you to
        // window.location.href = `/` // where it redirects you to
      }
    }
    catch (e) {
      setErrors({ server: "Could not reach the server."});
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='login-form-container'>
        <h2 className="sign-title">Sign up</h2>
        <Form onSubmit={handleSubmit} className="sign-form">


          <Form.Group className="sign-box" controlId="formBasicNickname">
            <Form.Control.Feedback type="invalid">
              {errors.nickname}
            </Form.Control.Feedback>
            <Form.Label >Nickname</Form.Label>
            <Form.Control className='sign-text-box'
              type="string"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              isInvalid={!!errors.nickname}
            />
          </Form.Group>


          <Form.Group className="sign-box" controlId="formBasicEmail">
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
            <Form.Label>Email address</Form.Label>
            <Form.Control className='sign-text-box'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
          </Form.Group>

          <Form.Group className="sign-box" controlId="formBasicPassword">
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
            <Form.Label >Password</Form.Label>
            <Form.Control className='sign-text-box'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
          </Form.Group>


          {errors.server && <Alert variant="danger">{errors.server}</Alert>} {/* shows error if nickname or email already exists in the DB. */}
          <Button variant="primary" type="submit" className="sign-button">
            Sell your soul
          </Button>
        </Form>
      </div>
    </div>
  );
}




function Login(){
  const [nick_email, setNickEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!nick_email) newErrors.nick_email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 3) newErrors.password = 'Password must be at least 3 characters';
    return newErrors;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nick_email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ server: data.error });
      } else {

        // TODO GET THE NICKNAME SO THAT THE HREF IS SET TO THE NAME AND NOT THE
        // EMAIL ADDRESS IF THAT IS WHAT IS USED TO LOGIN.

        // window.location.href = `/${nick_email}/home` // where it redirects you to
        window.location.href = `/` 
      }
    }
    catch (e) {
      setErrors({ server: "Could not reach the server."});
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='login-form-container'>
        <h2 className="login-title">Login</h2>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="login-box" controlId="formBasicEmail">
            <Form.Label>nickname or email</Form.Label>
            <Form.Control className='login-text-box'
              type="string"
              placeholder="Enter nickname or email"
              value={nick_email}
              onChange={(e) => setNickEmail(e.target.value)}
              isInvalid={!!errors.nick_email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nick_email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="login-box" controlId="formBasicPassword">
            <Form.Label >Password</Form.Label>
            <Form.Control className='login-text-box'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {errors.server && <Alert variant="danger">{errors.server}</Alert>} {/* shows error if nickname or email already exists in the DB. */}
          <Button variant="primary" type="submit" className="login-button">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App
