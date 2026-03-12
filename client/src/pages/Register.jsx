import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/AuthServices';
import './Register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Password confirmation does not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setIsSubmitting(false);
      navigate('/');
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.response?.data?.message || 'Unable to register');
    }
  };

  return (
    <div className="register-page">
      <section className="register-shell">
        <header className="register-hero">
          <h1>Collection Fossils</h1>
          <p>Create your account to start your collection</p>
        </header>

        <div className="register-card">
          <form onSubmit={handleSubmit} className="register-form">
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
                required
              />
            </label>

            {error && <p className="register-error">{error}</p>}

            <button type="submit" className="register-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <div className="register-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="register-link" onClick={() => navigate('/login')}>
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
