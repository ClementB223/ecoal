import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <a href="/">Logo</a>
                </div>
                
                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button>

                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    <li><a href="/collections">Collections</a></li>
                </ul>
            </div>
        </nav>
    );
}