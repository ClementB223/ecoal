import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import FossilCard from './components/FossilCard';
import headerImage from './assets/imgheader.png';
import LoginModal from './pages/Login';
import Register from './pages/Register';
import AddFossils from './pages/AddFossils';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
);

const DEFAULT_DB_IMAGE = `${API_BASE_URL}/uploads/fossil-default.svg`;
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const resolveImageUrl = (value) => {
  if (!value) {
    return DEFAULT_DB_IMAGE;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${API_BASE_URL}/${String(value).replace(/^\/+/, '')}`;
};

const parseYear = (value) => {
  const year = Number.parseInt(value, 10);
  return Number.isNaN(year) ? null : year;
};

const mapFossil = (fossil) => {
  const criteria = fossil?.criteria || {};
  const geologicalEra = fossil?.geological_era || fossil?.geologicalEra || {};
  const sizeCm = Number(criteria.size_cm ?? fossil?.size_cm ?? 0);
  const ageMyo = Number(criteria.age_myo ?? fossil?.age_myo ?? 0);
  const preservation = Number(criteria.preservation ?? fossil?.preservation ?? 0);
  const imagePath = fossil?.image_url || fossil?.image_path;
  const yearFromDateFound = parseYear(fossil?.date_found ?? fossil?.dateFound);
  const yearFromCreatedAt = fossil?.created_at ? new Date(fossil.created_at).getFullYear() : null;
  const dateYear = yearFromDateFound ?? yearFromCreatedAt;

  return {
    id: String(fossil?.id ?? ''),
    name: fossil?.name ?? 'Unknown fossil',
    description: fossil?.description ?? 'No description available.',
    era: geologicalEra?.name ?? 'Unknown',
    dateFound: dateYear ? String(dateYear) : 'Unknown',
    dateYear,
    ageMyo: Number.isFinite(ageMyo) ? ageMyo : 0,
    sizeCm: Number.isFinite(sizeCm) ? sizeCm : 0,
    sizeLabel: Number.isFinite(sizeCm) && sizeCm > 0 ? `${sizeCm} cm` : 'Unknown',
    preservation: Number.isFinite(preservation) ? preservation : 0,
    location:
      fossil?.geological_area ??
      fossil?.geologicalArea ??
      fossil?.collection?.name ??
      fossil?.collection?.user?.name ??
      'Unknown',
    image: resolveImageUrl(imagePath),
  };
};

const sortFossils = (items, sortBy) => {
  const list = [...items];

  switch (sortBy) {
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'size':
      return list.sort((a, b) => b.sizeCm - a.sizeCm);
    case 'oldest':
      return list.sort((a, b) => b.ageMyo - a.ageMyo);
    case 'rarity':
    default:
      return list.sort((a, b) => b.preservation - a.preservation);
  }
};

function HomePage() {
  const [fossils, setFossils] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedEras, setSelectedEras] = useState([]);
  const [sizeCategory, setSizeCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: MIN_YEAR, end: CURRENT_YEAR });
  const [minimumQuality, setMinimumQuality] = useState(0);
  const [sortBy, setSortBy] = useState('rarity');

  const availableEras = useMemo(() => {
    const eras = new Set(fossils.map((fossil) => fossil.era).filter(Boolean));
    return Array.from(eras).sort((a, b) => a.localeCompare(b));
  }, [fossils]);

  useEffect(() => {
    let isMounted = true;

    const fetchFossils = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const response = await axios.get(`${API_BASE_URL}/api/fossils`);
        const items = Array.isArray(response.data) ? response.data : [];

        if (isMounted) {
          setFossils(items.map(mapFossil));
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error?.response?.data?.message || error?.message || 'Unable to load fossils right now.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFossils();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFossils = useMemo(() => {
    return fossils.filter((fossil) => {
      const matchesEra = selectedEras.length === 0 || selectedEras.includes(fossil.era);

      const matchesSize =
        sizeCategory === 'all' ||
        (sizeCategory === 'small' && fossil.sizeCm <= 12) ||
        (sizeCategory === 'medium' && fossil.sizeCm > 12 && fossil.sizeCm <= 25) ||
        (sizeCategory === 'large' && fossil.sizeCm > 25);

      const matchesDate =
        fossil.dateYear === null ||
        (fossil.dateYear >= dateRange.start && fossil.dateYear <= dateRange.end);

      const matchesQuality = minimumQuality === 0 || fossil.preservation >= minimumQuality;

      return matchesEra && matchesSize && matchesDate && matchesQuality;
    });
  }, [fossils, selectedEras, sizeCategory, dateRange, minimumQuality]);

  const sortedFossils = useMemo(
    () => sortFossils(filteredFossils, sortBy),
    [filteredFossils, sortBy],
  );

  const toggleEra = (era) => {
    setSelectedEras((current) =>
      current.includes(era) ? current.filter((value) => value !== era) : [...current, era],
    );
  };

  const updateDateStart = (rawValue) => {
    setDateRange((current) => {
      const parsed = Number.parseInt(rawValue, 10);
      const nextStart = Number.isNaN(parsed) ? current.start : clamp(parsed, MIN_YEAR, current.end);
      return { ...current, start: nextStart };
    });
  };

  const updateDateEnd = (rawValue) => {
    setDateRange((current) => {
      const parsed = Number.parseInt(rawValue, 10);
      const nextEnd = Number.isNaN(parsed) ? current.end : clamp(parsed, current.start, CURRENT_YEAR);
      return { ...current, end: nextEnd };
    });
  };

  const resetFilters = () => {
    setSelectedEras([]);
    setSizeCategory('all');
    setDateRange({ start: MIN_YEAR, end: CURRENT_YEAR });
    setMinimumQuality(0);
    setSortBy('rarity');
  };

  return (
    <div className="fossil-page">
      <section className="hero-banner">
        <div className="hero-right">
          <div className="hero-copy">
            <h1>Collection Fossils</h1>
            <p>Complete your collection</p>
          </div>
          <img className="hero-image" src={headerImage} alt="Fossil illustration" />
        </div>
      </section>

      <section className="catalog-layout">
        <aside className="filters-panel">
          <div className="filters-header">
            <h2>Filter</h2>
            <div className="line" />
          </div>

          <div className="filter-group">
            <h3>Era</h3>
            <div className="check-list">
              {availableEras.map((era) => (
                <label key={era} className="check-item">
                  <input
                    type="checkbox"
                    checked={selectedEras.includes(era)}
                    onChange={() => toggleEra(era)}
                  />
                  <span>{era}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Size</h3>
            <div className="radio-list">
              <label className="check-item">
                <input
                  type="radio"
                  name="size-category"
                  checked={sizeCategory === 'small'}
                  onChange={() => setSizeCategory('small')}
                />
                <span>Small</span>
              </label>
              <label className="check-item">
                <input
                  type="radio"
                  name="size-category"
                  checked={sizeCategory === 'medium'}
                  onChange={() => setSizeCategory('medium')}
                />
                <span>Medium</span>
              </label>
              <label className="check-item">
                <input
                  type="radio"
                  name="size-category"
                  checked={sizeCategory === 'large'}
                  onChange={() => setSizeCategory('large')}
                />
                <span>Large</span>
              </label>
              <label className="check-item">
                <input
                  type="radio"
                  name="size-category"
                  checked={sizeCategory === 'all'}
                  onChange={() => setSizeCategory('all')}
                />
                <span>All</span>
              </label>
            </div>
          </div>

          <div className="filter-group">
            <h3>Date found</h3>
            <div className="range-values">
              <input
                type="number"
                min={MIN_YEAR}
                max={CURRENT_YEAR}
                value={dateRange.start}
                onChange={(event) => updateDateStart(event.target.value)}
              />
              <input
                type="number"
                min={MIN_YEAR}
                max={CURRENT_YEAR}
                value={dateRange.end}
                onChange={(event) => updateDateEnd(event.target.value)}
              />
            </div>
            <div className="range-sliders">
              <input
                type="range"
                min={MIN_YEAR}
                max={CURRENT_YEAR}
                value={dateRange.start}
                onChange={(event) => updateDateStart(event.target.value)}
              />
              <input
                type="range"
                min={MIN_YEAR}
                max={CURRENT_YEAR}
                value={dateRange.end}
                onChange={(event) => updateDateEnd(event.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <h3>Quality Preservation</h3>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`rating-mark ${minimumQuality >= level ? 'active' : ''}`}
                  onClick={() => setMinimumQuality((current) => (current === level ? 0 : level))}
                >
                  *
                </button>
              ))}
              <span>{minimumQuality || 0}</span>
            </div>
          </div>

          <button type="button" className="reset-filters" onClick={resetFilters}>
            Reset filter
          </button>
        </aside>

        <section className="catalog-panel">
          <header className="catalog-header">
            <p>Display {sortedFossils.length} fossils</p>
            <label>
              Filter by :
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="rarity">Rarety</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
          </header>

          <div className="catalog-content">
            {isLoading ? (
              <div className="status-box">Loading fossils...</div>
            ) : loadError ? (
              <div className="status-box">{loadError}</div>
            ) : sortedFossils.length === 0 ? (
              <div className="status-box">No fossils found with these filters.</div>
            ) : (
              <div className="cards-grid">
                {sortedFossils.map((fossil) => (
                  <FossilCard key={fossil.id} fossil={fossil} />
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  return <LoginModal isOpen onClose={() => navigate('/')} />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collection" element={<HomePage />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-fossil" element={<AddFossils />} />
      </Routes>
    </>
  );
}