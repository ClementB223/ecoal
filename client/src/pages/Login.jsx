import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/AuthServices';
import './Login.css';

export default function LoginModal({ isOpen = false, onClose, onSuccess, mode = 'popover' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const isPageMode = mode === 'page';

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleRegister = () => {
    if (onClose) onClose();
    navigate('/register');
  };

  const panel = (
    <div
      id="login-modal"
      className={`login-panel ${isPageMode ? 'login-panel--page' : 'login-panel--popover'}`}
      role="dialog"
      aria-modal={isPageMode ? 'true' : 'false'}
      aria-label="Login"
    >
      <div className="login-panel-header">
        <h2>Login</h2>
        {onClose ? (
          <button type="button" className="login-panel-close" onClick={onClose}>
            {isPageMode ? 'Back' : 'Close'}
          </button>
        ) : null}
      </div>

      <form className="login-panel-body" onSubmit={handleSubmit}>
        <label className="login-panel-field">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="login-panel-field">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p className="login-panel-error">{error}</p>}

        <button type="submit" className="login-panel-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="login-panel-footer">
        <span>Don&apos;t have an account?</span>
        <Link to="/register" onClick={handleRegister} className="login-switch-link">
          Register
        </Link>
      </div>
    </div>
  );

  if (isPageMode) {
    return (
      <div className="login-page">
        <section className="login-shell">
          <header className="login-hero">
            <h1>Collection Fossils</h1>
            <p>Sign in to continue your collection</p>
          </header>
          {panel}
        </section>
      </div>
    );
  }

  return (
    panel
  );
}
