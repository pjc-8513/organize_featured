import React from 'react';
import ExcelOrganizer from './components/ExcelOrganizer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Excel File Organizer</h1>
      </header>
      <main>
        <ExcelOrganizer />
      </main>
    </div>
  );
}

export default App;