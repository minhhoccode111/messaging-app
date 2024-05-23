import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './routes/router.jsx';
import './styles/index.css';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
