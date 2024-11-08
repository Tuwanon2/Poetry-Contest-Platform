import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import AllMarket from './components/AllMarket';
import MyCart from './pages/MyCart';
import Payment from './pages/Payment';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller/:sellerId" element={<AllMarket />} /> {/* แก้เส้นทางให้รับ sellerId */}
        <Route path="/MyCart" element={<MyCart />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
