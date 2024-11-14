import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { faTwitter, faFacebook, faWhatsapp, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../App.css'

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

const TheIcon = () => {
  const location = useLocation();

  return (
    <div className="elgy-tooltip-container">
    <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
      <span className="elgy-text">
        <FontAwesomeIcon icon={faTwitter} size="2x" />
      </span>
    </a>
    <a href="https://www.facebook.com/groups/1309994327041922" target="_blank" rel="noopener noreferrer">
      <span className="elgy-tooltip1">
        <FontAwesomeIcon icon={faFacebook} size="2x" />
      </span>
    </a>
    <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer">
      <span className="elgy-tooltip2">
        <FontAwesomeIcon icon={faWhatsapp} size="2x" />
      </span>
    </a>
    <a href="https://discord.com/yourserver" target="_blank" rel="noopener noreferrer">
      <span className="elgy-tooltip3">
        <FontAwesomeIcon icon={faDiscord} size="2x" />
      </span>
    </a>
  </div>
  );
};

export default TheIcon;
