import { useState } from 'react'
import './App.css'

import React from 'react'
import { Route, Routes, useParams } from "react-router-dom"

// Login
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
// import Local from 'passport-local';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/user/:nickname/home" element={<UserHome />} />
      <Route path="/user/:nickname/edit" element={<ProtectedRoute><UserEdit /></ProtectedRoute>} />
      <Route path="/four" element={<Four />} />
    </Routes>
  )
}

function Welcome() {
  return (
    <>
      <h1>Music Bridge</h1>
      <div className="icon">
        <a>
          <img className="logo" onClick={event => window.location.href='/home'} src="src/res/musicBridgeIdeaIcon.jpg"/>
        </a><br></br>
        yippee<p></p>
        We make a musik.<br></br>
      </div>
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("nickname", data.nickname);

        window.location.href = `/user/${nickname}/home` // where it redirects you to
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
    if (!nick_email) newErrors.nick_email = 'Email or nickname is required';
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("nickname", data.nickname);

        window.location.href = `/user/${data.nickname}/home` // where it redirects you to
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

function Home() {
  return (
    <>
      <h1>Music Bridge</h1>
      <div className="icon">
        homepage<p></p>
      </div>
    </>
  )
}

function UserHome() {
  const { nickname } = useParams();
  const isOwner = localStorage.getItem("nickname") === nickname;

  return (
    <div>
      <h1>{nickname}'s page</h1>
      {isOwner && (
        <button onClick={() => window.location.href = `/user/${nickname}/edit`}>
          Edit my page
        </button>
      )}
    </div>
  );
}

function UserEdit() {
  const { nickname } = useParams();

  return (
    <div>
      <h1>Edit your page, {nickname}</h1>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { nickname } = useParams();
  const storedNickname = localStorage.getItem("nickname");
  const token = localStorage.getItem("token");

  if (!token || storedNickname !== nickname){
    return window.location.href='/four'
  }
  return children;
}

function Four() {
  return (
    <>
      <h1>ACCESS DENIED</h1>
    </>
  )
}

export default App
