import { useState } from 'react';
import { NavLink } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <a href="/" className="navbar-logo">
            <NavLink to="/">Logo</NavLink>
          </a>
        </div>

        <div className="navbar-center">
            <a href="/" className="nav-link">
            <NavLink to="/">Home</NavLink>
            </a>
            <a href="/collections" className="nav-link">
            <NavLink to="/collection">Collection</NavLink>
            </a>
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className="profile-toggle"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="profile-menu"
          >
            <span class="material-symbols-outlined">
            account_circle
            </span>
          </button>
          {isOpen && (
            <div id="profile-menu" className="profile-menu" role="menu">
              <button type="button" className="profile-menu-item" role="menuitem">
                Edit
              </button>
              <button type="button" className="profile-menu-item danger" role="menuitem">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
