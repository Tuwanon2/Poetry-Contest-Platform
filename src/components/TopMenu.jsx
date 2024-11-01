import React from 'react';
import { Link } from 'react-router-dom';

const TopMenu = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          ME-Commerce
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/category">
                Fashion
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category">
                Supermarket
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category">
                Electronics
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category">
                Furniture
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category">
                Garden & Outdoors
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category">
                Jewellery
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;