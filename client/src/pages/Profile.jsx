import { useState } from 'react';
import { logout } from '../services/AuthServices';
import '../App.css';

export default function ProfilePopover({ isOpen = false, onClose, user, onLogout }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      await logout();
    } finally {
      setIsSubmitting(false);
      if (onLogout) onLogout();
      if (onClose) onClose();
    }
  };

  return (
    <div
      id="profile-popover"
      className="login-popover"
      role="dialog"
      aria-modal="false"
      aria-label="Profile"
    >
      <div className="modal-header">
        <h2>Edit Profile</h2>
        <button type="button" className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="modal-body">
        <label className="modal-field">
          Name
          <input type="text" defaultValue={user?.name || ''} placeholder="Your name" />
        </label>
        <label className="modal-field">
          Email
          <input type="email" defaultValue={user?.email || ''} placeholder="you@email.com" />
        </label>
        <button type="button" className="modal-submit" disabled>
          Save changes
        </button>
      </div>

      <div className="modal-footer">
        <span>Signed in as {user?.email || 'user'}</span>
        <button type="button" className="modal-link" onClick={handleLogout} disabled={isSubmitting}>
          {isSubmitting ? 'Signing out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
}
