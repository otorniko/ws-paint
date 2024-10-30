import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

import "normalize.css";
import "./styles.css";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root"),
);
