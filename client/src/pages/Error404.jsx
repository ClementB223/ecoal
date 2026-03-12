import { Link } from 'react-router-dom';
import './Error404.css';

export default function Error404() {
  return (
    <section className="error404-page">
      <div className="error404-card">
        <p className="error404-code">404</p>
        <h1>Page Not Found</h1>
        <p>We didn&apos;t find any fossils here.</p>
        <Link className="error404-home-btn" to="/">
          Go To Home
        </Link>
      </div>
    </section>
  );
}

