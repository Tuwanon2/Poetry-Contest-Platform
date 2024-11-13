import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import Seller from './pages/Seller';
import MyCart from './pages/MyCart';
import Payment from './pages/Payment';
import MyProfile from './pages/MyProfile';
import Shop from './pages/Shop';
import EditAddress from './pages/EditAddress';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller/:sellerId" element={<Seller />} /> {/* แก้เส้นทางให้รับ sellerId */}
        <Route path="/MyCart" element={<MyCart />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/EditAddress" element={<EditAddress />} />
        <Route path="/Contact" element={<Contact />} /> 
        <Route path="/shipping" element={<Shipping />} />

      </Routes>
    </Router>
  );
}

export default App;
