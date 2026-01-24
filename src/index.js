import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// สร้างคอมโพเนนต์หลักที่ใช้ useEffect
function Main() {
  useEffect(() => {
    // เพิ่มฟอนต์จาก Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Noto+Sans+Thai&display=swap';
    document.head.appendChild(link);
  }, []);

  return <App />;
}

root.render(
  // ปิด StrictMode ชั่วคราวเพื่อ debug
  // <React.StrictMode>
    <Main />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
