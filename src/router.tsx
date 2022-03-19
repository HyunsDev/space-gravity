import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Main from './screen/main';
import StressTest from './screen/stressTest';

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/stress" element={<StressTest />} />
        </Routes>
    </BrowserRouter>
  );
};