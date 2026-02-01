'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists in localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find(u => u.email === formData.email);

    if (!user) {
      setLoginError('No account found with this email');
      setIsLoading(false);
      return;
    }

    if (user.password !== formData.password) {
      setLoginError('Incorrect password');
      setIsLoading(false);
      return;
    }

    // Login successful
    localStorage.setItem('currentUser', JSON.stringify({
      email: user.email,
      fullName: user.fullName
    }));
    localStorage.setItem('isLoggedIn', 'true');

    setIsLoading(false);
    
    // Redirect to dashboard or home page
    router.push('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    if (loginError) {
      setLoginError('');
    }
  };

  return (
    <div className="auth-container">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Spectral:wght@300;400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --ink: #1a1614;
          --paper: #fdfcfb;
          --cream: #f4f1ec;
          --sepia: #8b7f76;
          --rust: #c1665a;
          --error: #dc2626;
        }

        body {
          font-family: 'Spectral', serif;
        }

        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, var(--paper) 0%, var(--cream) 100%);
          position: relative;
          overflow: hidden;
        }

        .auth-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 127, 118, 0.02) 2px, rgba(139, 127, 118, 0.02) 4px);
          pointer-events: none;
          animation: grain 8s steps(10) infinite;
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10%, 5%); }
        }

        .form-card {
          width: 100%;
          max-width: 450px;
          background: rgba(253, 252, 251, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(139, 127, 118, 0.15);
          border-radius: 8px;
          padding: 3rem 2.5rem;
          box-shadow: 0 8px 32px rgba(26, 22, 20, 0.08);
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          z-index: 1;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          font-weight: 300;
          color: var(--ink);
          text-align: center;
          margin-bottom: 0.5rem;
          letter-spacing: 0.03em;
        }

        .logo-accent {
          color: var(--rust);
          font-weight: 600;
        }

        .form-title {
          font-family: 'Spectral', serif;
          font-size: 1.75rem;
          font-weight: 400;
          color: var(--ink);
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          font-size: 0.95rem;
          color: var(--sepia);
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 0.5rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .form-input {
          width: 100%;
          padding: 0.95rem 1.25rem;
          font-family: 'Spectral', serif;
          font-size: 1rem;
          color: var(--ink);
          background: var(--paper);
          border: 1px solid rgba(139, 127, 118, 0.2);
          border-radius: 4px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }

        .form-input:focus {
          border-color: var(--rust);
          box-shadow: 0 0 0 3px rgba(193, 102, 90, 0.1);
          transform: translateY(-1px);
        }

        .form-input.error {
          border-color: var(--error);
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .form-input::placeholder {
          color: var(--sepia);
          opacity: 0.5;
        }

        .error-message {
          display: block;
          font-size: 0.85rem;
          color: var(--error);
          margin-top: 0.5rem;
          font-family: 'Spectral', serif;
        }

        .login-error {
          padding: 1rem;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 4px;
          color: var(--error);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem 2rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--paper);
          background: var(--ink);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }

        .submit-btn:hover::before {
          left: 100%;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(26, 22, 20, 0.15);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .toggle-section {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(139, 127, 118, 0.15);
        }

        .toggle-text {
          font-size: 0.9rem;
          color: var(--sepia);
          margin-bottom: 0.5rem;
        }

        .toggle-link {
          color: var(--rust);
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
        }

        .toggle-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--rust);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toggle-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        @media (max-width: 640px) {
          .form-card {
            padding: 2rem 1.5rem;
          }

          .logo {
            font-size: 2rem;
          }

          .form-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="form-card">
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Sign in to continue</p>

        {loginError && (
          <div className="login-error">{loginError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading && <span className="loading-spinner"></span>}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="toggle-section">
            <p className="toggle-text">Don't have an account?</p>
            <Link href="/signup" className="toggle-link">
              Create one here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}