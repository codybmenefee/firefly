import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [pingResult, setPingResult] = useState(null)

  // Debug log to verify anon key
  console.log('Anon Key in frontend:', import.meta.env.VITE_SUPABASE_ANON_KEY);

  const handlePing = async () => {
    try {
      const res = await fetch('http://localhost:54321/functions/v1/ping', {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });
      const data = await res.json();
      setPingResult(data.message);
    } catch (err) {
      setPingResult('Error contacting API');
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button style={{ marginLeft: 8 }} onClick={handlePing}>
          Ping API
        </button>
        {pingResult && (
          <p>Ping result: {pingResult}</p>
        )}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
