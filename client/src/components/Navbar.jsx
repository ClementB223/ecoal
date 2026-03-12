import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo2.png';
import LoginModal from '../pages/Login';
import ProfilePopover from '../pages/Profile';
import { getMe } from '../services/AuthServices';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const loadUser = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getMe()
      .then((me) => setUser(me))
      .catch(() => setUser(null));
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <NavLink to="/" className="navbar-logo" aria-label="Home">
            <img src={logo} alt="Logo" className="navbar-logo-image" />
          </NavLink>
        </div>

        <div className="navbar-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/collection"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Collection
          </NavLink>
        </div>

        <div className="navbar-right">
          {user ? (
            <NavLink to="/add-fossil" className="add-fossil-button">
              <span className="material-symbols-outlined" aria-hidden="true">
                add
              </span>
              <span>Add</span>
            </NavLink>
          ) : null}
          <button
            type="button"
            className="profile-toggle"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls={user ? 'profile-popover' : 'login-modal'}
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          {user ? (
            <ProfilePopover
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              user={user}
              onLogout={() => setUser(null)}
            />
          ) : (
            <LoginModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onSuccess={loadUser}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
