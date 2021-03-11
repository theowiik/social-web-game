import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './main.css';
import reportWebVitals from './reportWebVitals';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV == "production" ? "/api/v1" : "localhost:8080/api/v1";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
