import api from './api';

const fetchComments = (movieId, page = 1, limit = 10) =>
  api
    .get(`/movies/${movieId}/comments`, { params: { page, limit } })
    .then(res => res.data);

const postComment = (movieId, text) =>
  api.post(`/movies/${movieId}/comments`, { text }).then(res => res.data);

const updateComment = (movieId, commentId, text) =>
  api.put(`/movies/${movieId}/comments/${commentId}`, { text })
     .then(res => res.data);

const deleteComment = (movieId, commentId) =>
  api.delete(`/movies/${movieId}/comments/${commentId}`).then(res => res.data);

export default {
  fetchComments,
  postComment,
  updateComment,
  deleteComment
};