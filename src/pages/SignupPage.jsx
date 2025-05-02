import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import authService from '../services/auth.service';

const SignupPage = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();
  const location                = useLocation();
  // rota de retorno (passada pelo Navbar)
  const from                    = location.state?.from || '/movies';

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // regista e guarda o token recebido
      const { token } = await authService.signup(name, email, password);
      localStorage.setItem('token', token);
      // redireciona para a página de onde veio
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro no registo');
    }
  };

  return (
    <div className="container col-md-6 col-lg-4 mt-5">
      <h1 className="h3 mb-3 text-center">Registo</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Registar</button>
      </form>
      <p className="mt-3 text-center">
        Já tens conta? <Link to="/login" state={{ from }}>Entra</Link>
      </p>
    </div>
  );
};

export default SignupPage;
