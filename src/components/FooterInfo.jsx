import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import '../App.css'


  const FooterInfo = () =>{
    const { sellerId } = useParams();
    const sellerHours = {
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': {
          Monday: '09:00 - 18:00 น.',
          Tuesday: '09:00 - 18:00 น.',
          Wednesday: '09:00 - 18:00 น.',
          Thursday: '09:00 - 18:00 น.',
          Friday: '09:00 - 18:00 น.',
          Saturday: '09:00 - 18:00 น.',
          Sunday: 'CLOSED',
        },
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': {
          Monday: 'CLOSED',
          Tuesday: '12.00 - 23.00 น.',
          Wednesday: '12.00 - 23.00 น.',
          Thursday: '12.00 - 23.00 น.',
          Friday: '12.00 - 23.00 น.',
          Saturday: '10.00 - 23.00 น.',
          Sunday: '10.00 - 23.00 น.',
        },
        '940256ba-a9de-4aa9-bad8-604468cb6af3': {
          Monday: '12.00 - 24.00 น.',
          Tuesday: '12.00 - 24.00 น.',
          Wednesday: 'CLOSED',
          Thursday: '12.00 - 24.00 น.',
          Friday: '12.00 - 24.00 น.',
          Saturday: '12.00 - 24.00 น.',
          Sunday: '12.00 - 24.00 น.',
        },
        '494d4f06-225c-463e-bd8a-6c9caabc1fc4': {
          Monday: '09.00 - 18.00 น.',
          Tuesday: '09:00 - 18:00 น.',
          Wednesday: '09:00 - 18:00 น.',
          Thursday: '09:00 - 18:00 น.',
          Friday: '09:00 - 18:00 น.',
          Saturday: 'CLOSED',
          Sunday: 'CLOSED',
        },
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': {
          Monday: '14:00 - 00:00  น.',
          Tuesday: '14:00 - 00:00  น.',
          Wednesday: '14:00 - 00:00  น.',
          Thursday: '14:00 - 00:00  น.',
          Friday: '14:00 - 00:00  น.',
          Saturday: '11:00 - 00:00  น.',
          Sunday: '11:00 - 00:00  น.',
        },
      };
      const sellerLocation = {
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': { lat: 13.7527745, lng: 100.636673 },
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': { lat: 13.7945357, lng: 100.3275824 },
        '940256ba-a9de-4aa9-bad8-604468cb6af3': { lat: 13.8097455, lng: 100.0425045 },
        '494d4f06-225c-463e-bd8a-6c9caabc1fc4': { lat: 13.749195, lng: 100.5568222 },
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': { lat: 13.7427682, lng: 100.5246512 },
      };
      const mapStyles = {
        height: "300px",
        width: "100%",
      };

      const defaultCenter = sellerLocation[sellerId] || { lat: 13.7563, lng: 100.5018 }; 


      return(
        
        <footer>
<Container>
    <Row>
        <Col>
        <div>

<h3>เวลาเปิดร้าน</h3>
<ul>
  {Object.entries(sellerHours[sellerId]).map(([day, hours]) => (
    <li key={day}>
      {day}: {hours}
    </li>
  ))}
</ul>
</div>
        </Col>
        <Col>
            <h3>ตำแหน่งร้าน</h3>
            <LoadScript googleMapsApiKey="YOUR_API_KEY">
              <GoogleMap mapContainerStyle={mapStyles} zoom={15} center={defaultCenter}>
                <Marker position={defaultCenter} />
              </GoogleMap>
            </LoadScript>
          </Col>

    </Row>
</Container>


  </footer>

      )
  };
  export default FooterInfo;