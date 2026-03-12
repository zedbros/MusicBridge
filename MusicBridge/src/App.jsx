import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

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
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}
      <br></br>
      <div className="cred_table">        
        <button>Sign Up</button>
        <button>Log In</button>
      </div>
    </>
  )
}
 
export default App
