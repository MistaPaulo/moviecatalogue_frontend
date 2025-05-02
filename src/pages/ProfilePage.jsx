import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProfilePage = () => {
  const [user, setUser]               = useState(null);
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]         = useState('');
  const [error, setError]             = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/users/me');
        const data = res.data;
        if (!data) {
          throw new Error('Sessão inválida');
        }
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error('Erro a carregar perfil:', err);
        navigate('/login', { replace: true });
      }
    };
    loadProfile();
  }, [navigate]);

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
      const updated = res.data;
      setUser(updated);
      setPassword('');
      setConfirmPassword('');
      setMessage('Perfil atualizado!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Erro ao atualizar o perfil.');
    }
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
