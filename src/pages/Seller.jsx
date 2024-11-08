import React from 'react';
import { useParams } from 'react-router-dom'; // นำเข้า useParams เพื่อดึง sellerId
import TopNav from '../components/TopNav';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';
import Products from '../components/Products';
import AllMarket from '../components/AllMarket';

const Seller = () => {
  const { sellerId } = useParams(); // ดึง sellerId จาก URL

  return (
    <div>
      <TopNav />
      <TopMenu />
      <Products />
      <AllMarket sellerId={sellerId} /> {/* ส่ง sellerId ไปยัง AllMarket */}
      <Footer />
    </div>
  );
};

export default Seller;
