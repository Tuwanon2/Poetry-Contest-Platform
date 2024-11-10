import React from 'react';
import { useParams } from 'react-router-dom';
import TopNav from '../components/TopNav';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';
import Products from '../components/Products';
import AllMarket from '../components/AllMarket';
import '../App.css';

const Seller = () => {
  const { sellerId } = useParams(); // Get sellerId from URL

  return (
    <div>
      <TopNav />
      <TopMenu />
      {/* Pass sellerId to Products if filtering by seller is needed */}
      <Products sellerId={sellerId} /> 
      <AllMarket sellerId={sellerId} /> {/* Pass sellerId to AllMarket */}
      <Footer />
    </div>
  );
};

export default Seller;
