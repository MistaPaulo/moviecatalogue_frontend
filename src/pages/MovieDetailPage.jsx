import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import movieService from '../services/movie.service';
import commentService from '../services/comment.service';
import CommentForm from '../components/CommentForm';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie]             = useState(null);
  const [comments, setComments]       = useState([]);
  const [recs, setRecs]               = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingId, setEditingId]     = useState(null);
  const [editText, setEditText]       = useState('');

  // carregamento inicial de filme, recomendações e user
  useEffect(() => {
    const load = async () => {
      try {
        const [ m, recsRes ] = await Promise.all([
          movieService.fetchMovieById(id),
          movieService.fetchRecommendations(id),
        ]);
        setMovie(m);
        setRecs(recsRes);

        const token = localStorage.getItem('token');
        if (token) {
          try {
            const me = await api.get('/users/me').then(r => r.data);
            setCurrentUser(me);
          } catch {
            // ignora 401
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados do filme:', err);
      }
    };
    load();
    loadComments(1);
  }, [id]);

  // paginação de comentários
  const [commentPage, setCommentPage]         = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const loadComments = async (page = 1) => {
    try {
      const res = await api.get(`/movies/${id}/comments`, {
        params: { page, limit: 10 }
      });
      setComments(res.data.comments);
      setCommentPage(res.data.page);
      setCommentTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    }
  };

  const handleNewComment = comment => {
    loadComments(1);
    setMovie(prev => ({
      ...prev,
      num_mflix_comments: (prev.num_mflix_comments || 0) + 1
    }));
  };

  const handleDeleteComment = async commentId => {
    try {
      await commentService.deleteComment(id, commentId);
      loadComments(commentPage);
      setMovie(prev => ({
        ...prev,
        num_mflix_comments: (prev.num_mflix_comments || 1) - 1
      }));
    } catch (err) {
      console.error('Erro ao apagar comentário:', err);
    }
  };

  const handleEditClick = c => {
    setEditingId(c._id);
    setEditText(c.text);
  };

  const handleSaveEdit = async commentId => {
    try {
      const updated = await commentService.updateComment(id, commentId, editText);
      setComments(comments.map(c => c._id === commentId ? updated : c));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Erro ao editar comentário:', err);
    }
  };

  if (!movie) {
    return <p className="text-center mt-5">Carregando...</p>;
  }

  const PosterBox = ({ src, alt }) => (
    <div
      style={{
        width: '100%',
        aspectRatio: '10/16',
        borderRadius: '0.25rem',
        boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
    >
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4 text-center">
        {movie.title} <small className="text-muted">({movie.year})</small>
      </h1>

      <div className="row align-items-start mb-5">
        <div className="col-lg-4 mb-3">
          <PosterBox src={movie.poster} alt={movie.title} />
        </div>
        <div className="col-lg-8">
          <h2 className="h5 mb-2">Sinopse</h2>
          <p className="mb-4">{movie.plot}</p>
          {movie.fullplot && (
            <>
              <h5>Enredo</h5>
              <p className="mb-4">{movie.fullplot}</p>
            </>
          )}
          <div className="row">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li><strong>Lançamento:</strong> {movie.released ? new Date(movie.released).toLocaleDateString() : '-'}</li>
                <li><strong>Género:</strong> {movie.genres?.join(', ')}</li>
                <li><strong>Duração:</strong> {movie.runtime} min</li>
                <li><strong>Classificação:</strong> {movie.rated}</li>
                <li><strong>Diretores:</strong> {movie.directors?.join(', ')}</li>
                <li><strong>Escritores:</strong> {movie.writers?.join(', ')}</li>
                <li>
                  <strong>Premiações:</strong>{' '}
                  {movie.awards
                    ? movie.awards.text || `${movie.awards.wins} wins, ${movie.awards.nominations} nom.`
                    : '–'}
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li><strong>Elenco:</strong> {movie.cast?.join(', ')}</li>
                <li><strong>Idiomas:</strong> {movie.languages?.join(', ')}</li>
                <li>
                  <strong>IMDb:</strong>{' '}
                  {movie.imdb?.rating != null
                    ? `${movie.imdb.rating} ⭐ (${movie.imdb.votes} votos)`
                    : '–'}
                </li>
                {movie.tomatoes?.viewer?.rating != null && (
                  <li>
                    <strong>Rotten Tomatoes (Viewer):</strong> {movie.tomatoes.viewer.rating} ({movie.tomatoes.viewer.numReviews} reviews)
                  </li>
                )}
                {movie.tomatoes?.critic?.rating != null && (
                  <li>
                    <strong>Rotten Tomatoes (Critic):</strong> {movie.tomatoes.critic.rating} ({movie.tomatoes.critic.numReviews} reviews)
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <h2 className="h4 mb-3">Recomendações</h2>
      {recs.length > 0 ? (
        <div className="row g-4 mb-5">
          {recs.map(r => (
            <div key={r._id} className="col-6 col-sm-4 col-md-3 col-lg-2">
              <Link to={`/movies/${r._id}`} className="d-block text-center text-decoration-none text-dark">
                <PosterBox src={r.poster} alt={r.title} />
                <p className="small mt-2 text-truncate" title={r.title}>{r.title}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Sem recomendações disponíveis.</p>
      )}

      <hr />

      <h2 className="h4 mb-3">Comentários ({movie.num_mflix_comments || 0})</h2>
      {currentUser && <CommentForm movieId={id} onCommentAdded={handleNewComment} />}

      <ul className="list-group mb-3">
        {comments.map(c => (
          <li key={c._id} className="list-group-item position-relative">
            <strong>{c.name}:</strong>{' '}
            {editingId === c._id ? (
              <>
                <textarea
                  className="form-control mb-2"
                  rows="2"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleSaveEdit(c._id)}
                >
                  Salvar
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingId(null)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                {c.text}
                <br />
                <small className="text-muted">{new Date(c.date).toLocaleString()}</small>
                {currentUser?.email === c.email && (
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditClick(c)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteComment(c._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      <nav className="d-flex justify-content-center align-items-center mb-4">
        <button
          className="btn btn-outline-secondary me-3"
          disabled={commentPage <= 1}
          onClick={() => loadComments(commentPage - 1)}
        >
          Anterior
        </button>
        <span>Página {commentPage} de {commentTotalPages}</span>
        <button
          className="btn btn-outline-secondary ms-3"
          disabled={commentPage >= commentTotalPages}
          onClick={() => loadComments(commentPage + 1)}
        >
          Seguinte
        </button>
      </nav>
    </div>
  );
};

export default MovieDetailPage;
