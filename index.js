import React from 'react';
import ReactDOM from 'react-dom';
import '@coreui/coreui/dist/css/coreui.min.css';
import ExcelOrganizer from './components/ExcelOrganizer';

ReactDOM.render(
  <React.StrictMode>
    <ExcelOrganizer />
  </React.StrictMode>,
  document.getElementById('root')
);