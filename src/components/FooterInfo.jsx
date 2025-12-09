import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';


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
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11':  'https://www.google.com/maps/place/Siam+Board+Games+Co.,+Ltd.+%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97+%E0%B8%AA%E0%B8%A2%E0%B8%B2%E0%B8%A1%E0%B8%9A%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%94%E0%B9%80%E0%B8%81%E0%B8%A1+%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94/@13.7528315,100.6324349,17z/data=!3m1!4b1!4m6!3m5!1s0x311d61e899af1d51:0x20fc9e996963a11e!8m2!3d13.7528315!4d100.6373058!16s%2Fg%2F11qpt5rjds?entry=ttu&g_ep=EgoyMDI0MTExMi4wIKXMDSoASAFQAw%3D%3D' ,
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22':  'https://www.google.com/maps/place/Lanlalen/@13.7945357,100.1875067,12z/data=!4m10!1m2!2m1!1z4Lil4Liy4LiZ4Lil4Liw4LmA4Lil4LmI4LiZ!3m6!1s0x30e293f4ac79e893:0x66fb30deae9c1ae0!8m2!3d13.7945357!4d100.3275824!15sChvguKXguLLguJnguKXguLDguYDguKXguYjguJmSAQ9ib2FyZF9nYW1lX2NsdWLgAQA!16s%2Fg%2F119v0lmnt?entry=ttu&g_ep=EgoyMDI0MTExMi4wIKXMDSoASAFQAw%3D%3D' ,
        '940256ba-a9de-4aa9-bad8-604468cb6af3':  'https://www.google.com/maps/place/Velalonglen+Boardgames+Society/@13.8097455,100.0399296,17z/data=!3m1!4b1!4m6!3m5!1s0x30e2e5ab51060e11:0x1119417270d52619!8m2!3d13.8097455!4d100.0425045!16s%2Fg%2F11h_17n9lt?entry=ttu&g_ep=EgoyMDI0MTExMi4wIKXMDSoASAFQAw%3D%3D' ,
        '494d4f06-225c-463e-bd8a-6c9caabc1fc4':  'https://www.google.com/maps/place/Tower+Tactic+Games+Co.,+Ltd./@13.749195,100.5519513,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29fb8284ab4dd:0xc134d7a18333de50!8m2!3d13.749195!4d100.5568222!16s%2Fg%2F11t5l7rbzl?entry=ttu&g_ep=EgoyMDI0MTExMi4wIKXMDSoASAFQAw%3D%3D' ,
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35':  'https://www.google.com/maps/place/Dice+Cup+(Board+Game+Cafe)/@13.7427682,100.5220763,17z/data=!3m1!4b1!4m6!3m5!1s0x30e2992c2ee06cbf:0x3a94c9e58ebe5f35!8m2!3d13.7427682!4d100.5246512!16s%2Fg%2F11bwfjxqh2?entry=ttu&g_ep=EgoyMDI0MTExMi4wIKXMDSoASAFQAw%3D%3D' ,
      };
      const sellerEmail = {
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11':  'support@siamboardgames.com' ,
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22':  'lanlalenbgcafe@gmail.com' ,
        '940256ba-a9de-4aa9-bad8-604468cb6af3':  'veralonglen.info@gmail.com' ,
        '494d4f06-225c-463e-bd8a-6c9caabc1fc4':  'support@towertacticgames.com' ,
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35':  'dicecup.bgc@gmail.com' ,
      };
      const sellerPhone = {
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11':  '094-565-0511' ,
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22':  '081-850-1453 , 091-778-1453' ,
        '940256ba-a9de-4aa9-bad8-604468cb6af3':  '094-147-4703' ,
        '494d4f06-225c-463e-bd8a-6c9caabc1fc4':  '061-272-2800' ,
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35':  '094-569-6223' ,
      };
      const mapStyles = {
        height: "300px",
        width: "100%",
      };


      return(

        


        
        <div style={{
          position: 'relative', 
          display:'flex',
          bottom: 0, 
          left: 0, 
          width: '100%', 
          backgroundColor: '#70136C', 
          color:'white',
          padding: '10px 0', 
          zIndex: 1000,  // Ensures it stays on top of other content
          boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.2)',  // Optional: Adds a slight shadow for better visibility
          
        }}>
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
                <a href={sellerLocation[sellerId]} target="_blank" rel="noopener noreferrer">
                  <div>
                    <img 
                      src="../assets/images/Map.gif" 
                      alt="Map" 
                      style={{ height: '150px', width: '150px' }}
                    />
                  </div>
                </a>
              </Col>
              <Col>
                <h3>อีเมล</h3>
                <a>{sellerEmail[sellerId]}</a>
                <h3>เบอร์โทร</h3>
                <a>{sellerPhone[sellerId]}</a>
              </Col>
            </Row>
          </Container>
        </div>
        

      )
      
  };
  export default FooterInfo;