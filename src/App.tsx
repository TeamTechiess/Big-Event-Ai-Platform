import React from 'react'
import FloorPlanEditor from './components/FloorPlanEditor'
import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="h-[calc(100vh-80px)]">
        <FloorPlanEditor />
      </main>
    </div>
  )
}

export default App
