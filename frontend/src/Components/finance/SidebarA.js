import React from 'react';
import { NavLink } from 'react-router-dom';
import './css/Sidebar.css';

function SidebarA() {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin/sells" activeClassName="active-link">
            Sells
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/cashbook" activeClassName="active-link">
            CashBook
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/finance/paybil" activeClassName="active-link">
            Add PayBill
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/finance/paybildash" activeClassName="active-link">
            PayBill
          </NavLink>
        </li>
        <li>
          <NavLink to="/finance/otherExpenciveForm" activeClassName="active-link">
            Expense Form
          </NavLink>
        </li>
        <li>
          <NavLink to="/finance/otherExpencive" activeClassName="active-link">
           Expense
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default SidebarA;
