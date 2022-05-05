import React from 'react';
import Router from './router'
import ToastProvider from './context/toast';

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <Router />
      </ToastProvider>
    </div>
  );
}

export default App;
