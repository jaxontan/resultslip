import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div>
      <h1>Academic Result Slip</h1>
      <p style={{ color: '#94a3b8', marginTop: '-1.5rem', marginBottom: '3rem' }}>
        Track your performance and reach your targets
      </p>
      <Dashboard />
    </div>
  );
}

export default App;
