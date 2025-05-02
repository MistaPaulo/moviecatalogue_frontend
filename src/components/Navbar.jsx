import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth.service';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = useRef(location.pathname);
  const token = localStorage.getItem('token');

  const handleBrandClick = () => {
    navigate('/movies', { replace: true });
    window.location.reload();
  };

  const handleLoginClick = () => {
    returnTo.current = location.pathname;
    navigate('/login', { state: { from: returnTo.current } });
  };

  const handleSignupClick = () => {
    returnTo.current = location.pathname;
    navigate('/signup', { state: { from: returnTo.current } });
  };

  const handleLogout = async () => {
    returnTo.current = location.pathname;
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    navigate(returnTo.current, { replace: true });
    if (returnTo.current.startsWith('/movies/')) {
      window.location.reload();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <button
          className="navbar-brand btn btn-link p-0 text-decoration-none text-white"
          onClick={handleBrandClick}
        >
          Catálogo de Filmes
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto">
            {token ? (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={() => navigate('/profile')}
                  >
                    Perfil
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleSignupClick}
                  >
                    Registo
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
