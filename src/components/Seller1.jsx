import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import axios from 'axios';

const Seller1 = () => {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch('/api/v1/sellers:$seller_id');
        const data = await response.json();
        setSellers(data);
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    };

    fetchSellers();
  }, []);

  return (
    <div>
      <h1>List of Sellers</h1>
      <ul>
        {sellers.map((seller) => (
          <li key={seller.seller_id}>{seller.name}</li>
        ))}
      </ul>
    </div>
  );
};


export default Seller1;
