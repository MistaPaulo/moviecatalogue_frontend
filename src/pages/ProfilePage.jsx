import React, { useState, useEffect } from 'react';
import authService from '../services/auth.service';
import api from '../services/api';

const ProfilePage = () => {
  const [user, setUser]               = useState(null);
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]         = useState('');
  const [error, setError]             = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const res = await api.get('/users/me');
      setUser(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
    };
    loadProfile();
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password && password !== confirmPassword) {
      setError('As passwords não coincidem.');
      return;
    }

    try {
      const payload = { name, email };
      if (password) payload.password = password;
      const res = await api.patch('/users/me', payload);
      setUser(res.data);
      setPassword('');
      setConfirmPassword('');
      setMessage('Perfil atualizado!');
    } catch (err) {
      setError('Erro ao atualizar o perfil.');
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  if (!user) return <p className="text-center mt-5">Carregando...</p>;

  return (
    <div className="container col-md-6 col-lg-4 mt-5">
      <h1 className="h3 mb-3 text-center">O Meu Perfil</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error   && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Nova Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Repetir Nova Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Atualizar
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
