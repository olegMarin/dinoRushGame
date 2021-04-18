import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axi from './axiosf'
import mockRead from './mockRead'

const isMockRead = true

const Wrapper = () => {
  const [base, setBase] = useState(null)

  useEffect(() => {
    if (isMockRead) {
      setBase(mockRead)
    } else {
      axi("start.php", "read", { qr: new Date()}).then(
        (result) => {
          if (result.type == 'approved') {
              setBase(result.questions)
              console.log(result.questions)
          } else {
          }
        },
        (e) => { console.log(e) }
      )
    }
  }, [])

  return base ? <App base={base} /> : null
}

ReactDOM.render(
  <React.StrictMode>
    <Wrapper />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
