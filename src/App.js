import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';  // ตรวจสอบการ import ตรงนี้
import ProductDetail from './pages/ProductDetail'; // เพิ่มการนำเข้า ProductDetail
import Shop from './pages/Shop';
import MyCart from './pages/MyCart';
import Payment from './pages/Payment';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/MyCart" element={<MyCart />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:productId" element={<ProductDetail />} /> {/* เส้นทางสำหรับหน้า ProductDetail */}
      </Routes>
    </Router>
  );
}

export default App;