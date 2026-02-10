import React from 'react';
import {  Routes, Route } from 'react-router-dom';
// import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';



function App() {
  return (
        <main className="min-h-screen w-full overflow-x-hidden">
          <Routes>
           {/* <Route path='/' element={<Dashboard />} /> */}
           <Route path='/' element={<LandingPage />} />
           </Routes>
           
        </main>
  );
}

export default App;