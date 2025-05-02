import api from './api';

const signup = (name, email, password) =>
  api.post('/auth/signup', { name, email, password }).then(res => res.data);

const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(res => {
    const { token } = res.data;
    localStorage.setItem('token', token);
    return res.data;
  });

const logout = () => {
  // Primeiro tentamos invalidar a sessão no servidor
  return api.post('/auth/logout')
    .catch(err => {
      // Ignora 401 caso a sessão já tenha expirado ou sido invalidada
      if (err.response?.status !== 401) {
        throw err;
      }
    })
    .finally(() => {
      // Remove sempre o token local
      localStorage.removeItem('token');
    });
};

export default {
  signup,
  login,
  logout
};
