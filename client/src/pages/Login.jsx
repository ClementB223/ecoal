import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/AuthServices';
import '../App.css';

export default function LoginModal({ isOpen = false, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div
      id="login-modal"
      className="login-popover"
      role="dialog"
      aria-modal="false"
      aria-label="Login"
    >
      <div className="modal-header">
        <h2>Login</h2>
        <button type="button" className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>

      <form className="modal-body" onSubmit={handleSubmit}>
        <label className="modal-field">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="modal-field">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p className="modal-error">{error}</p>}

        <button type="submit" className="modal-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="modal-footer">
        <span>Don’t have an account?</span>
        <Link to="/register" onClick={handleRegister} className="modal-link">
          Register
        </Link>
      </div>
    </div>
  );
}
