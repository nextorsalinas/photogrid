// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // solo estos
import Home from './components/Home';
import Preview from './components/Preview';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/preview" element={<Preview />} />
  </Routes>
);

export default App;
