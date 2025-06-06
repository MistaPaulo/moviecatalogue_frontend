import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  // Se movie.poster for null/undefined/"" já usamos a capa por defeito
  const [src, setSrc] = useState(movie.poster || '/default-cover.png');

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <Link to={`/movies/${movie._id}`} className="text-decoration-none text-dark">
        <div className="card h-100">
          <div style={{ width: '100%', aspectRatio: '10/16', overflow: 'hidden' }}>
            <img
              src={src}
              alt={movie.title}
              onError={() => setSrc('/default-cover.png')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="card-body">
            <h5 className="card-title">{movie.title}</h5>
            <p className="card-text text-muted">{movie.year}</p>
            <p className="card-text mb-1">
              {movie.genres?.join(', ') || '—'}
            </p>
            <p className="card-text">
              {movie.imdb?.rating != null
                ? `IMDb ${movie.imdb.rating.toFixed(1)}⭐`
                : 'IMDb —'}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
