import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import Filters from '../components/Filters';
import movieService from '../services/movie.service';

const HomePage = () => {
  const [movies, setMovies]   = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage]       = useState(1);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);

  const loadMovies = async (params = {}) => {
    setLoading(true);
    try {
      const { movies, total } = await movieService.fetchMovies({ ...filters, page, ...params });
      setMovies(movies);
      setTotal(total);
    } catch (err) {
      console.error(err);
      setMovies([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [filters, page]);

  const handleFilterChange = newFilters => {
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <div className="container py-4">
      <h1 className="h2 mb-4 text-center">Catálogo de Filmes</h1>
      <Filters onFilterChange={handleFilterChange} />

      {loading ? (
        <p className="text-center mt-5">Carregando...</p>
      ) : movies.length > 0 ? (
        <>
          <div className="row g-4">
            {movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
              </li>

              <li className="page-item disabled">
                <span className="page-link">
                  Página {page} de {totalPages}
                </span>
              </li>

              <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Seguinte
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <p className="text-center mt-5">Nenhum filme encontrado.</p>
      )}
    </div>
  );
};

export default HomePage;
