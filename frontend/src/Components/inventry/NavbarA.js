import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './css/NavbarA.css';
import img2 from "../ui/img/WhatsApp Image 2024-09-21 at 01.51.31_83da0e81.jpg";

function NavbarA() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    // For example: localStorage.removeItem('token');
    
    // Redirect to login page
    navigate('/login'); // Adjust the path as necessary
    alert("Logged out successfully!");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">Admin Panel</NavLink>
      </div>
      <ul className="navbar-menu">
        <li>
          <NavLink to="/admin/inventory" activeClassName="active-link">Inventory</NavLink>
        </li>
        <li>
          <NavLink to="/admin/cart" activeClassName="active-link">Shopping Cart</NavLink>
        </li>
        <li>
          <NavLink to="/admin/orders" activeClassName="active-link">Orders</NavLink>
        </li>
        <li>
          <NavLink to="/admin/delivery" activeClassName="active-link">Delivery</NavLink>
        </li>
        <li>
          <NavLink to="/admin/employee" activeClassName="active-link">Employee</NavLink>
        </li>
        <li>
          <NavLink to="/admin/customers" activeClassName="active-link">Customer</NavLink>
        </li>
        <li>
          <NavLink to="/admin/sells" activeClassName="active-link">Finance</NavLink>
        </li>
        <li>
          <NavLink to="/admin/payment" activeClassName="active-link">Payment</NavLink>
        </li>
      </ul>
      <div className="navbar-user">
        <img src={img2} alt="User Avatar" className="user-avatar" />
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        {/* Optionally, add a dropdown for user settings */}
      </div>
    </nav>
  );
}

export default NavbarA;
