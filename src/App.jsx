import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landingpage from './components/Landingpage';

function App() {
  return (
        <main>
           <Header />
           <Landingpage />
           <Footer />
        </main>
  );
}

export default App;