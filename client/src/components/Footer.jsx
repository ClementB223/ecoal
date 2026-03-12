import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo2.png';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="site-footer__inner">
                <div className="site-footer__brand">
                    <img src={logo} alt="Fossil's Collection" className="site-footer__logo" />
                    <div>
                        <h3>Fossil&apos;s Collection</h3>
                        <p>
                            Curated fossils, eras, and discoveries from collectors around the world.
                        </p>
                    </div>
                </div>

                <div className="site-footer__column">
                    <h4>Explore</h4>
                    <Link to="/">Home</Link>
                    <Link to="/collection">Collections</Link>
                    <Link to="/add-fossil">Add a fossil</Link>
                </div>

                <div className="site-footer__column">
                    <h4>Collection</h4>
                    <Link to="/collection/me">My fossils</Link>
                    <span>Era highlights</span>
                    <span>Preservation notes</span>
                </div>
            </div>

            <div className="site-footer__bottom">
                <span>© {year} Fossil&apos;s Collection</span>
                <span>Built for paleontology enthusiasts</span>
            </div>
        </footer>
    );
}