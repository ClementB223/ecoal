import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import './styles/responsive/responsive.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './pages/Login';
import Register from './pages/Register';
import AddFossils from './pages/AddFossils';
import FossilCard from './components/FossilCard';
import headerImage from './assets/imgheader2.png';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import MyCollectionEdit from './pages/MyCollectionEdit';
import FossilDetail from './components/FossilDetail';
import Error404 from './pages/Error404';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
);

const DEFAULT_DB_IMAGE = `${API_BASE_URL}/uploads/fossil-default.svg`;
const MIN_MYO = 0;
const MAX_MYO = 600;

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

const formatAgeLabel = (ageMyo) => {
  return Number.isFinite(ageMyo) && ageMyo > 0 ? `${ageMyo} MYO` : 'Unknown';
};

const formatPreservationLabel = (preservation) => {
  return Number.isFinite(preservation) && preservation > 0 ? `${preservation}/5` : 'Unknown';
};

const mapFossil = (fossil) => {
  const criteria = fossil?.criteria || {};
  const geologicalEra = fossil?.geological_era || fossil?.geologicalEra || {};
  const sizeCm = Number(criteria.size_cm ?? fossil?.size_cm ?? 0);
  const ageMyo = Number(criteria.age_myo ?? fossil?.age_myo ?? 0);
  const preservation = Number(criteria.preservation ?? fossil?.preservation ?? 0);
  const imagePath = fossil?.image_url || fossil?.image_path;
  const continent = criteria.continent ?? fossil?.continent ?? fossil?.geological_area ?? null;
  const dateFoundLabel =
    Number.isFinite(ageMyo) && ageMyo > 0 ? `${ageMyo} MYO` : fossil?.date_found ?? 'Unknown';

  return {
    id: String(fossil?.id ?? ''),
    name: fossil?.name ?? 'Unknown fossil',
    description: fossil?.description ?? 'No description available.',
    era: geologicalEra?.name ?? 'Unknown',
    dateFound: dateFoundLabel,
    ageMyo: Number.isFinite(ageMyo) ? ageMyo : 0,
    sizeCm: Number.isFinite(sizeCm) ? sizeCm : 0,
    sizeLabel: Number.isFinite(sizeCm) && sizeCm > 0 ? `${sizeCm} cm` : 'Unknown',
    preservation: Number.isFinite(preservation) ? preservation : 0,
    location: continent || 'Unknown',
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
  const navigate = useNavigate();
  const [fossils, setFossils] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedEras, setSelectedEras] = useState([]);
  const [sizeCategory, setSizeCategory] = useState('all');
  const [ageRange, setAgeRange] = useState({ start: MIN_MYO, end: MAX_MYO });
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

      const matchesAge =
        fossil.ageMyo <= 0 || (fossil.ageMyo >= ageRange.start && fossil.ageMyo <= ageRange.end);

      const matchesQuality = minimumQuality === 0 || fossil.preservation >= minimumQuality;

      return matchesEra && matchesSize && matchesAge && matchesQuality;
    });
  }, [fossils, selectedEras, sizeCategory, ageRange, minimumQuality]);

  const sortedFossils = useMemo(
    () => sortFossils(filteredFossils, sortBy),
    [filteredFossils, sortBy],
  );
  const toggleEra = (era) => {
    setSelectedEras((current) =>
      current.includes(era) ? current.filter((value) => value !== era) : [...current, era],
    );
  };

  const updateAgeStart = (rawValue) => {
    setAgeRange((current) => {
      const parsed = Number.parseFloat(rawValue);
      const nextStart = Number.isNaN(parsed) ? current.start : clamp(parsed, MIN_MYO, current.end);
      return { ...current, start: nextStart };
    });
  };

  const updateAgeEnd = (rawValue) => {
    setAgeRange((current) => {
      const parsed = Number.parseFloat(rawValue);
      const nextEnd = Number.isNaN(parsed) ? current.end : clamp(parsed, current.start, MAX_MYO);
      return { ...current, end: nextEnd };
    });
  };

  const resetFilters = () => {
    setSelectedEras([]);
    setSizeCategory('all');
    setAgeRange({ start: MIN_MYO, end: MAX_MYO });
    setMinimumQuality(0);
    setSortBy('rarity');
  };

  const openFossilDetails = (fossil) => {
    navigate(`/fossils/${fossil.id}`, { state: { fossil } });
  };

  const fossilCountLabel = isLoading ? '--' : fossils.length;
  const eraCountLabel = isLoading ? '--' : availableEras.length;
  return (
    <div className="fossil-page">
      <section className="hero-banner">
        <div className="hero-right">
          <div className="hero-copy">
            <h1>Collection Fossils</h1>
            <p>Complete your collection</p>
            <ul className="hero-stats" aria-label="Collection stats">
              <li className="hero-stat">
                <span className="material-symbols-outlined" aria-hidden="true">
                  history_edu
                </span>
                <strong>{fossilCountLabel}</strong>
                <span>Fossils</span>
              </li>
              <li className="hero-stat">
                <span className="material-symbols-outlined" aria-hidden="true">
                  layers
                </span>
                <strong>{eraCountLabel}</strong>
                <span>Eras</span>
              </li>
            </ul>
          </div>
          <img className="hero-image" src={headerImage} alt="Fossil illustration" />
        </div>
      </section>

      <section className="hero-insights" aria-label="Collection highlights">
        <article className="hero-insight">
          <span className="hero-insight-icon material-symbols-outlined" aria-hidden="true">
            travel_explore
          </span>
          <h3>Found locations</h3>
          <p>Europe • Asia • America</p>
        </article>

        <article className="hero-insight">
          <span className="hero-insight-icon material-symbols-outlined" aria-hidden="true">
            history_edu
          </span>
          <h3>Oldest fossil</h3>
          <p>245 million years</p>
        </article>

        <article className="hero-insight">
          <span className="hero-insight-icon material-symbols-outlined" aria-hidden="true">
            star
          </span>
          <h3>Collection rarity</h3>
          <p>12 rare specimens</p>
        </article>
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
            <h3>Age (MYO)</h3>
            <div className="range-values">
              <input
                type="number"
                min={MIN_MYO}
                max={MAX_MYO}
                value={ageRange.start}
                onChange={(event) => updateAgeStart(event.target.value)}
              />
              <input
                type="number"
                min={MIN_MYO}
                max={MAX_MYO}
                value={ageRange.end}
                onChange={(event) => updateAgeEnd(event.target.value)}
              />
            </div>
            <div className="range-sliders">
              <input
                type="range"
                min={MIN_MYO}
                max={MAX_MYO}
                value={ageRange.start}
                onChange={(event) => updateAgeStart(event.target.value)}
              />
              <input
                type="range"
                min={MIN_MYO}
                max={MAX_MYO}
                value={ageRange.end}
                onChange={(event) => updateAgeEnd(event.target.value)}
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
              Sort by :
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
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
                  <FossilCard
                    key={fossil.id}
                    fossil={fossil}
                    onMoreClick={openFossilDetails}
                    meta={[
                      { icon: 'straighten', label: 'Size :', value: fossil.sizeLabel },
                      { icon: 'hourglass_top', label: 'Age :', value: formatAgeLabel(fossil.ageMyo) },
                      {
                        icon: 'star',
                        label: 'Preservation :',
                        value: formatPreservationLabel(fossil.preservation),
                      },
                      { icon: 'layers', label: 'Era :', value: fossil.era },
                    ]}
                  />
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
  return <LoginModal isOpen mode="page" onClose={() => navigate('/')} onSuccess={() => navigate('/')} />;
}

export default function App() {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <div className="app-surface">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/add-fossil"
          element={isAuthenticated ? <AddFossils /> : <Navigate to="/login" replace />}
        />
        <Route path="/fossils/:fossilId" element={<FossilDetail />} />
        <Route path="/collection" element={<Collections />} />
        <Route path="/collection/:id" element={<CollectionDetail />} />
        <Route path="/collection/me" element={<MyCollectionEdit />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Footer />
    </div>
  );
}
