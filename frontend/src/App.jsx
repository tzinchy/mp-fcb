import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import AffairsPage from './AffairsPage';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/affairs" />} />
      <Route path="/affairs" element={<AffairsPage />} />
      <Route path="*" element={<Navigate to="/affairs" />} />
    </Routes>
  );
}


export default App
