import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import axios from 'axios';

const AllMarket = () => {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const placeholderImage = '../assets/namoo-logo.jpg'; // Placeholder for missing logos

  useEffect(() => {
    // Fetch sellers data
    axios.get('/api/v1/sellers?sort=seller&order=asc&limit=16')
      .then(response => setSellers(response.data))
      .catch(error => console.error('Error fetching sellers:', error));

    // Fetch products data
    axios.get('/api/v1/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <Container>
      <h2>All Stores and Products</h2>
      <Row>
        {sellers.map(seller => {
          // Filter products that match the seller's seller_id
          const sellerProducts = products.filter(product => product.seller_id === seller.id);
          
          return (
            <Col key={seller.id} md={4} className="mb-4">
              <Card className="text-center">
                <Card.Body>
                  {/* Circular logo */}
                  <div className="mb-3">
                    <Image 
                      src={seller.logo_url || placeholderImage}
                      roundedCircle
                      alt={seller.name} 
                      style={{ width: '100px', height: '100px' }}
                      onError={(e) => { e.target.src = placeholderImage }} // Fallback to placeholder
                    />
                  </div>
                  <Card.Title>{seller.name}</Card.Title>
                  <Card.Text>{seller.contact_info}</Card.Text>
                  
                  <h5>Products:</h5>
                  {sellerProducts.length > 0 ? (
                    sellerProducts.map(product => (
                      <div key={product.id} className="mb-2">
                        <strong>{product.name}</strong><br />
                        <span>Price: ${product.price}</span>
                      </div>
                    ))
                  ) : (
                    <p>No products available.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default AllMarket;
