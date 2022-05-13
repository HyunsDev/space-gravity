import React from 'react';
import Router from './router'
import ToastProvider from './context/toast';
import SettingProvider from './context/setting';
import WorkerProvider from './context/worker';

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <SettingProvider>
          <WorkerProvider>
            <Router />
          </WorkerProvider>
        </SettingProvider>
      </ToastProvider>
    </div>
  );
}

export default App;
