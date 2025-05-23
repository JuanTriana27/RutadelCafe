import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Elimina BrowserRouter de aquí
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Hero backgroundImage="/images/rutadelcafe.jpg"/>} />
      </Routes>
    </div>
  );
}

export default App;