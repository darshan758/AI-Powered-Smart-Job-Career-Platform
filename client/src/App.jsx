import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">
        Backend says: {status || 'loading...'}
      </h1>
    </div>
  )
}

export default App