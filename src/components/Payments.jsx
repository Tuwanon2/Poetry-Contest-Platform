import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';

const placeholderImage = '/assets/images/placeholder.jpg';

const Payment = () => {
  const navigate = useNavigate();  
  const [order, setOrder] = useState({
    items: [],
    total: 0
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [address, setAddress] = useState({});
  const [discountPercentage, setDiscountPercentage] = useState(3); 
  const [subtotal, setSubtotal] = useState(0);  

  const isDiscountApplicable = (percentage) => {
    if (percentage === 3) return true;
    if (percentage === 5) return subtotal >= 1500;
    if (percentage === 10) return subtotal >= 4000;
    return false;
  };

  const sellerNames = {
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': 'SIAM BOARDGAME',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': 'Lanlalen',
    '940256ba-a9de-4aa9-bad8-604468cb6af3': 'TIME TO PLAY',
    '494d4f06-225c-463e-bd8a-6c9caabc1fc4': 'Towertactic',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': 'DiceCUP',
  };
  
  const getSellerImage = (sellerId) => {
    const images = {
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': '/assets/images/SIAM_BOARDGAME.jpg',
      'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': '/assets/images/Lanlalen.jpg',
      '940256ba-a9de-4aa9-bad8-604468cb6af3': '/assets/images/TIME_TO_PLAY.jpg',
      '494d4f06-225c-463e-bd8a-6c9caabc1fc4': '/assets/images/Towertactic.jpg',
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35': '/assets/images/DiceCUP.jpg',
    };
    return images[sellerId] || '/assets/default_image.png';
  };
  
  const getSellerName = (sellerId) => {
    return sellerNames[sellerId] || 'Unknown';
  };
  const placeholderImage = '../assets/images/placeholder.jpg';
  const groupItemsByStore = (items) => {
    return items.reduce((stores, item) => {
      const store = item.seller_id || 'ไม่ระบุชื่อร้าน'; 
      if (!stores[store]) {
        stores[store] = [];
      }
      stores[store].push(item);
      return stores;
    }, {});
  };

  const initialStatus = {
    statusMessages: [
      { message: "สั่งซื้อสินค้าสำเร็จ", time: new Date().toLocaleString('th-TH') }
    ],
  };
  localStorage.setItem('orderStatus', JSON.stringify(initialStatus));
  

  const calculateShippingCost = (storeItems) => {
    return storeItems.length > 0 ? 45 : 0;
  };
  const isAddressValid = () => {
    return address.firstName && address.lastName && address.phone && address.address && address.district && address.province && address.postalCode;
  };
  
  const handleConfirmPayment = () => {
    if (!isAddressValid()) {
      alert('กรุณากรอกที่อยู่ให้ครบถ้วนก่อนทำการสั่งซื้อ');
      return;
    }
  
    // Show confirmation dialog
    const confirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยืนยันการชำระเงิน?');
    if (confirmed) {
      // Save order details to localStorage
      const orderDetails = {
        items: order.items,
        subtotal: subtotal,
        discountPercentage: discountPercentage,
        totalShipping: totalShipping,
        grandTotal: grandTotal,
        address: address,
        paymentMethod: paymentMethod,
      };
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
  
      localStorage.removeItem('cart');
      alert('การชำระเงินเสร็จสมบูรณ์');
      navigate('/Ship1'); // Navigate to the Shipping page after confirmation
    }
  };

  const handlePaymentCompletion = (orderData) => {
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
  };
  

  
  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem('cart'));
    if (storedOrder) {
      const total = storedOrder.reduce((acc, product) => acc + product.price * (product.quantity || 1), 0);
      setOrder({ items: storedOrder, total: total });
      setSubtotal(total);
    }

    const storedAddress = JSON.parse(localStorage.getItem('address'));
    if (storedAddress) {
      setAddress(storedAddress);
    }
  }, []);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleDiscountChange = (e) => {
    setDiscountPercentage(Number(e.target.value));
  };



  const handleNavigateToChooseAddress = () => {
    navigate('/EditAddress');
  };

  const groupedItems = groupItemsByStore(order.items);

  const calculateGrandTotal = () => {
    const discount = (subtotal * discountPercentage) / 100;
    const shippingCosts = Object.keys(groupedItems).map(storeId => calculateShippingCost(groupedItems[storeId]));
    const totalShipping = shippingCosts.reduce((acc, cost) => acc + cost, 0);
    const grandTotal = (subtotal - discount) + totalShipping;
    return grandTotal;
  };

  const totalShipping = Object.keys(groupedItems).map(storeId => calculateShippingCost(groupedItems[storeId])).reduce((acc, cost) => acc + cost, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const grandTotal = calculateGrandTotal();

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <center><h1>สรุปรายการสั่งซื้อ</h1></center>
      </Row>

      {/* ส่วนแสดงที่อยู่ */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body style={{ position: 'relative' }}>
              <h3>ที่อยู่สำหรับจัดส่ง</h3>
              {address.firstName ? (
                <div>
                  <p>{address.firstName} {address.lastName} │ {address.phone}</p>
                  <p>{address.company} {address.address}, {address.subDistrict}, {address.street}, {address.district}, {address.province}, {address.country}, {address.postalCode}</p>
                </div>
              ) : (
                <p>กรุณากรอกที่อยู่ในการจัดส่ง</p>
              )}

              
   <button class="Btn" onClick={handleNavigateToChooseAddress} style={{ position: 'absolute', bottom: '20px', right: '10px', backgroundColor: '#CC0066' }} >แก้ไข
      <svg class="svg" viewBox="0 0 512 512">
        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
    </button>




            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ส่วนแสดงรายละเอียดสินค้า */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h3>รายละเอียดการสั่งซื้อ</h3>
            </Card.Header>
            <Card.Body>
              {Object.keys(groupedItems).map((storeId, index) => (
                <div key={index}>
                  {/* แสดงโลโก้และชื่อร้าน */}
                  <Row className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                    <Col sm={1} style={{ paddingLeft: '0' }}>
                      {/* แสดงโลโก้ร้าน */}
                      <Image
                        src={getSellerImage(storeId)}  // เรียกฟังก์ชันเพื่อดึงโลโก้ร้าน
                        rounded
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col sm={11} style={{ paddingLeft: '10px' }}>
                      {/* แสดงชื่อร้าน */}
                      <h5>{getSellerName(storeId)}</h5>
                    </Col>
                  </Row>

                  {/* รายการสินค้าของร้านนี้ */}
                  {groupedItems[storeId].map((item, itemIndex) => (
                    <Row key={itemIndex} className="mb-3">
                      <Col sm={2}>
                        {/* แสดงรูปสินค้า */}
                        <Image
                          src={item.images?.[0]?.image_url || placeholderImage}
                          rounded
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = placeholderImage; }}
                        />
                      </Col>
                      <Col sm={10}>
                        {/* แสดงชื่อสินค้า */}
                        <h4>{item.name}</h4>
                        <Row>
                          <Col sm={8}>
                            {/* แสดงราคาและจำนวน */}
                            <strong style={{ fontSize: '1.2rem' }}>฿{item.price} x {item.quantity}</strong>
                          </Col>
                          <Col sm={4} className="text-end">
                            {/* แสดงราคารวม */}
                            <strong style={{ fontSize: '1.2rem' }}>฿{item.price * item.quantity}</strong>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
              
      {/* ส่วนเลือกส่วนลด */}
      <Row className="mb-4">
        <Col>
          <Card>
          <Card.Body>
              <h3>เลือกส่วนลด</h3>
              <Form.Group controlId="discountSelect">
                <Form.Label>เลือกรหัสส่วนลด (%)</Form.Label>
                <Form.Control 
                  as="select" 
                  value={discountPercentage} 
                  onChange={handleDiscountChange}>
                  <option value={3} disabled={!isDiscountApplicable(3)}>3% (ทุกยอดสั่งซื้อ)</option>
                  <option value={5} disabled={!isDiscountApplicable(5)}>5% (เมื่อยอดเกิน 1,500 บาท)</option>
                  <option value={10} disabled={!isDiscountApplicable(10)}>10% (เมื่อยอดเกิน 4,000 บาท)</option>
                </Form.Control>
                {!isDiscountApplicable(discountPercentage) && (
                  <p className="text-danger mt-2">ยอดสั่งซื้อไม่ถึงเกณฑ์ในการใช้ส่วนลด {discountPercentage}%</p>
                )}
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
                
      {/* ส่วนสรุปยอดการชำระเงิน */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h3>สรุปยอดการชำระเงิน</h3>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={8}>ยอดรวมสินค้า</Col>
                <Col sm={4} className="text-end">฿{subtotal}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={8}>ส่วนลด ({discountPercentage}%)</Col>
                <Col sm={4} className="text-end">฿{discountAmount.toFixed(2)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={8}>ค่าจัดส่ง</Col>
                <Col sm={4} className="text-end">฿{totalShipping}</Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col sm={8}><h4>ยอดชำระทั้งหมด</h4></Col>
                <Col sm={4} className="text-end"><h4>฿{grandTotal.toFixed(2)}</h4></Col>
              </Row>
              <Card>
  <Card.Body>
    <h3>เลือกวิธีการชำระเงิน</h3>
    <Form>
      <div className="checkbox-wrapper-4">
        <input 
          className="inp-cbx" 
          id="creditCard" 
          type="radio" 
          name="paymentMethod" 
          value="creditCard" 
          checked={paymentMethod === 'creditCard'} 
          onChange={handlePaymentMethodChange}
        />
        <label className="cbx" htmlFor="creditCard">
          <span>
            <svg width="12px" height="10px">
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
            </svg>
          </span>
          <span className="custom-radio-label">บัตรเครดิต</span>
        </label>
      </div>

      <div className="checkbox-wrapper-4">
        <input 
          className="inp-cbx" 
          id="bankTransfer" 
          type="radio" 
          name="paymentMethod" 
          value="bankTransfer" 
          checked={paymentMethod === 'bankTransfer'} 
          onChange={handlePaymentMethodChange}
        />
        <label className="cbx" htmlFor="bankTransfer">
          <span>
            <svg width="12px" height="10px">
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
            </svg>
          </span>
          <span className="custom-radio-label">โอนเงินผ่านธนาคาร</span>
        </label>
      </div>

      <div className="checkbox-wrapper-4">
        <input 
          className="inp-cbx" 
          id="cashOnDelivery" 
          type="radio" 
          name="paymentMethod" 
          value="cashOnDelivery" 
          checked={paymentMethod === 'cashOnDelivery'} 
          onChange={handlePaymentMethodChange}
        />
        <label className="cbx" htmlFor="cashOnDelivery">
          <span>
            <svg width="12px" height="10px">
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
            </svg>
          </span>
          <span className="custom-radio-label">เก็บเงินปลายทาง</span>
        </label>
      </div>
    </Form>
  </Card.Body>
</Card>




<div 
    className="btn-container" 
    onClick={() => isAddressValid() && handleConfirmPayment()} 
    style={{ 
        backgroundColor: '#CC0066', 
        padding: '4px 10px', 
        borderRadius: '20px',
        height: '50px', 
        width: '250px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: 'transform 0.2s ease, background-color 0.2s ease'  // เพิ่ม transition เพื่อทำให้แอนิเมชันราบรื่น
    }}
    >
    <a 
        className="btn-content" 
        href="#"
        style={{ padding: '4px 10px', display: 'flex', alignItems: 'center' }}
       
    >
        <span className="btn-title" style={{ fontSize: "80%", marginRight: '10px',color:'white' }}>ยืนยันการชำระเงิน</span>
        <span className="icon-arrow">
            <svg width="30px" height="30px" viewBox="0 0 66 43">
                <g id="arrow" fill="none" fillRule="evenodd">
                    <path id="arrow-icon-one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                </g>
            </svg>
        </span> 
    </a>
</div>


      

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
