import api from './api';

const fetchMovies = params =>
  api
    .get('/movies', { params: { limit: 12, ...params } })
    .then(res => res.data);

const fetchMovieById = id =>
  api.get(`/movies/${id}`).then(res => res.data);

const fetchRecommendations = async id => {
  try {
    const res = await api.get(`/movies/${id}/recommendations`);
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
};

const fetchGenres = () =>
  api.get('/movies/genres').then(res => res.data);

const fetchLanguages = () =>
  api.get('/movies/languages').then(res => res.data);

export default {
  fetchMovies,
  fetchMovieById,
  fetchRecommendations,
  fetchGenres,
  fetchLanguages
};
