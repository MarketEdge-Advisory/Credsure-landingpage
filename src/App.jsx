import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';



function App() {
  return (
        <main className="min-h-screen w-full overflow-x-hidden">
          <Routes>
           <Route path='/' element={<Dashboard />} />
           </Routes>
           
        </main>
  );
}

export default App;