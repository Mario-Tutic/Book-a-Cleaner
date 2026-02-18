import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';

import { FaBroom } from "react-icons/fa";

import './DashboardHeader.css'
import './Header.css'

export function DashboardHeader() {
    return (
        <>
            <div className='header glass'>
                <div className='left-section'>
                    <div className="logo">
                        <FaBroom size={42} />
                    </div>
                </div>
                <div className="navbar-links">
                    <NavLink
                        to="/owner/dashboard"
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/bookings"
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        Bookings
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        Profile
                    </NavLink>
                    <NavLink
                        to="/logout"
                        className="nav-item"
                    >
                        Logout
                    </NavLink>
                </div>
                <div className='right-section'>
                    <Link to="">Log out</Link>
                </div>
            </div>

        </>
    )
}