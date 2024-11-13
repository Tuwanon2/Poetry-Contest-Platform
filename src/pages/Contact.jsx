import React from 'react';
import TopNav from '../components/TopNav';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';
import Contact_Data from '../components/Contact_Data';
 
const Contact = () => {
  return (
    <div style={{ fontFamily: "'Prompt', sans-serif", backgroundColor: '#f7f1e3' }}>
      <TopNav />
      <TopMenu />
      <Contact_Data/>
      <Footer />
    </div>
  );
};

export default Contact;
