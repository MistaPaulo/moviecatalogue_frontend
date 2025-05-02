import React, { useState, useEffect, useRef } from 'react';
import movieService from '../services/movie.service';

const Filters = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [ratingMin, setRatingMin] = useState('');
  const [ratingMax, setRatingMax] = useState('');
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const genreDropdownRef = useRef(null);

  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Fetch genres & languages
  useEffect(() => {
    movieService.fetchGenres().then(setGenres);
    movieService.fetchLanguages().then(setLanguages);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = e => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(e.target)) {
        setGenreDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleGenre = g =>
    setSelectedGenres(sel =>
      sel.includes(g) ? sel.filter(x => x !== g) : [...sel, g]
    );

  const toggleLanguage = l =>
    setSelectedLanguages(sel =>
      sel.includes(l) ? sel.filter(x => x !== l) : [...sel, l]
    );

  const buildFilters = () => ({
    search: search.trim() || undefined,
    ratingMin: ratingMin || undefined,
    ratingMax: ratingMax || undefined,
    yearMin: yearMin || undefined,
    yearMax: yearMax || undefined,
    genres: selectedGenres.length ? selectedGenres : undefined,
    languages: selectedLanguages.length ? selectedLanguages : undefined,
    director: director.trim() || undefined,
    cast: cast.trim() || undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined
  });

  const handleSubmit = e => {
    e.preventDefault();
    onFilterChange(buildFilters());
  };

  const handleClear = () => {
    setSearch('');
    setRatingMin('');
    setRatingMax('');
    setYearMin('');
    setYearMax('');
    setDirector('');
    setCast('');
    setSelectedGenres([]);
    setSelectedLanguages([]);
    setSortBy('');
    setSortOrder('');
    onFilterChange({});
  };

  // Whenever sort changes, apply immediately
  useEffect(() => {
    onFilterChange(buildFilters());
  }, [sortBy, sortOrder]);

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {/* Linha 1: Pesquisa + Géneros + Idiomas */}
      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-3" ref={genreDropdownRef}>
          <button
            type="button"
            className="btn btn-outline-secondary w-100 text-start"
            onClick={() => setGenreDropdownOpen(o => !o)}
          >
            Géneros {selectedGenres.length > 0 && `(${selectedGenres.length})`}
          </button>
          <ul
            className={`dropdown-menu${genreDropdownOpen ? ' show' : ''}`}
            style={{ maxHeight: 200, overflowY: 'auto' }}
          >
            {genres.map(g => (
              <li key={g}>
                <label className="dropdown-item mb-0">
                  <input
                    type="checkbox"
                    className="me-2"
                    checked={selectedGenres.includes(g)}
                    onChange={() => toggleGenre(g)}
                  />
                  {g}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-3" ref={langDropdownRef}>
          <button
            type="button"
            className="btn btn-outline-secondary w-100 text-start"
            onClick={() => setLangDropdownOpen(o => !o)}
          >
            Idiomas {selectedLanguages.length > 0 && `(${selectedLanguages.length})`}
          </button>
          <ul
            className={`dropdown-menu${langDropdownOpen ? ' show' : ''}`}
            style={{ maxHeight: 200, overflowY: 'auto' }}
          >
            {languages.map(l => (
              <li key={l}>
                <label className="dropdown-item mb-0">
                  <input
                    type="checkbox"
                    className="me-2"
                    checked={selectedLanguages.includes(l)}
                    onChange={() => toggleLanguage(l)}
                  />
                  {l}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Linha 2: IMDb / Ano / Diretor / Elenco */}
      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-6 d-flex gap-2">
          <input
            type="number"
            step="0.1"
            placeholder="IMDb mín."
            value={ratingMin}
            onChange={e => setRatingMin(e.target.value)}
            className="form-control flex-fill"
          />
          <input
            type="number"
            step="0.1"
            placeholder="IMDb máx."
            value={ratingMax}
            onChange={e => setRatingMax(e.target.value)}
            className="form-control flex-fill"
          />
          <input
            type="number"
            placeholder="Ano mín."
            value={yearMin}
            onChange={e => setYearMin(e.target.value)}
            className="form-control flex-fill"
          />
          <input
            type="number"
            placeholder="Ano máx."
            value={yearMax}
            onChange={e => setYearMax(e.target.value)}
            className="form-control flex-fill"
          />
        </div>
        <div className="col-md-6 d-flex gap-2">
          <input
            type="text"
            placeholder="Diretor"
            value={director}
            onChange={e => setDirector(e.target.value)}
            className="form-control flex-fill"
          />
          <input
            type="text"
            placeholder="Elenco"
            value={cast}
            onChange={e => setCast(e.target.value)}
            className="form-control flex-fill"
          />
        </div>
      </div>

      {/* Linha 3: Filtrar + Limpar + Ordenar */}
      <div className="d-flex align-items-center mt-2" style={{ paddingTop: '0.2rem' }}>
        <button
          type="submit"
          className="btn btn-secondary flex-grow-1 me-2"
          style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}
        >
          Filtrar
        </button>
        <button
          type="button"
          className="btn btn-danger me-3"
          onClick={handleClear}
          style={{ fontSize: '1.1rem', padding: '0.65rem 1rem', whiteSpace: 'nowrap' }}
        >
          Limpar filtros
        </button>
        <div className="d-flex align-items-center">
          <label className="mb-0 me-2">Ordenar por:</label>
          <select
            className="form-select me-2"
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={e => {
              const v = e.target.value;
              setSortBy(v);
              setSortOrder(v ? 'desc' : '');
            }}
          >
            <option value="">—</option>
            <option value="title">Título</option>
            <option value="year">Ano</option>
            <option value="imdb.rating">Nota IMDB</option>
          </select>
          <div className="btn-group" role="group" aria-label="Ordem">
            <input
              type="radio"
              className="btn-check"
              name="order"
              id="order-desc"
              autoComplete="off"
              checked={sortOrder === 'desc'}
              onChange={() => setSortOrder('desc')}
              disabled={!sortBy}
            />
            <label className="btn btn-outline-secondary" htmlFor="order-desc">
              Desc
            </label>
            <input
              type="radio"
              className="btn-check"
              name="order"
              id="order-asc"
              autoComplete="off"
              checked={sortOrder === 'asc'}
              onChange={() => setSortOrder('asc')}
              disabled={!sortBy}
            />
            <label className="btn btn-outline-secondary" htmlFor="order-asc">
              Cresc
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Filters;
