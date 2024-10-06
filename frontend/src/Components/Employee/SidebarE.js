import React from 'react';
import { NavLink } from 'react-router-dom';
import '../inventry/css/Sidebar.css';

function SidebarE() {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin/employee" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Employee List
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/employee/form" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Add New Employee
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/employee/salary-form" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Add Employee Salary
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/employee/salary-dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Salary Dashboard
          </NavLink>

          <NavLink to="/admin/employee/Summery" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Employee Summary
          </NavLink>

          <NavLink to="/admin/employee/attendence" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Attendance
          </NavLink>

          <NavLink to="/admin/employee/attDashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Attendance Dashboard
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default SidebarE;
