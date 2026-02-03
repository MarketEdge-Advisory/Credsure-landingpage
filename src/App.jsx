import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';



function App() {
  return (
        <main>
          <Routes>
           <Route path='/' element={<Dashboard />} />
           </Routes>
           
        </main>
  );
}

export default App;