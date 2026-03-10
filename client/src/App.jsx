import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import LoginModal from './pages/Login';
import Register from './pages/Register';
import AddFossils from './pages/AddFossils';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
);
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1651980802497-2ad4b4adbb5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const mapFossil = (fossil) => {
  const criteria = fossil?.criteria || {};
  const geologicalEra = fossil?.geological_era || fossil?.geologicalEra || {};
  const sizeCm = Number(criteria.size_cm ?? 0);
  const imagePath = fossil?.image_url || fossil?.image_path;

  return {
    id: String(fossil?.id ?? ''),
    name: fossil?.name ?? 'Unknown fossil',
    scientificName: fossil?.scientific_name ?? fossil?.scientificName ?? '--',
    geologicalArea: fossil?.geological_area ?? fossil?.geologicalArea ?? 'Unknown',
    dateFound: fossil?.date_found ?? fossil?.dateFound ?? '--',
    size: sizeCm ? `${sizeCm} cm` : '--',
    sizeInCm: Number.isFinite(sizeCm) ? sizeCm : 0,
    era: geologicalEra?.name ?? 'Unknown',
    period: fossil?.period ?? geologicalEra?.name ?? '--',
    type: fossil?.type ?? '--',
    image: imagePath ? `${API_BASE_URL}/${imagePath}` : FALLBACK_IMAGE,
    description: fossil?.description ?? '',
  };
};

function FossilCard({ fossil }) {
  return (
    <article className="fossil-card">
      <div className="fossil-image-wrap">
        <img src={fossil.image} alt={fossil.name} className="fossil-image" />
        <span className="badge badge-era">{fossil.era}</span>
      </div>
      <div className="fossil-body">
        <div>
          <h3 className="fossil-title">{fossil.name}</h3>
          <p className="fossil-scientific">{fossil.scientificName}</p>
        </div>

        <p className="fossil-description">{fossil.description}</p>

        <div className="fossil-meta">
          <p>Location: {fossil.geologicalArea}</p>
          <p>Found: {fossil.dateFound}</p>
          <p>Size: {fossil.size}</p>
        </div>

        <div className="badge-row">
          <span className="badge badge-outline">{fossil.period}</span>
          <span className="badge badge-outline">{fossil.type}</span>
        </div>
      </div>
    </article>
  );
}

function FilterSidebar({
  searchTerm,
  onSearchChange,
  selectedAreas,
  onAreasChange,
  availableAreas,
  dateRange,
  onDateRangeChange,
  sizeRange,
  onSizeRangeChange,
  maxSize,
  onReset,
}) {
  const toggleArea = (area) => {
    if (selectedAreas.includes(area)) {
      onAreasChange(selectedAreas.filter((item) => item !== area));
      return;
    }
    onAreasChange([...selectedAreas, area]);
  };

  const handleSizeMin = (value) => {
    const min = Number(value);
    onSizeRangeChange([Math.min(min, sizeRange[1]), sizeRange[1]]);
  };

  const handleSizeMax = (value) => {
    const max = Number(value);
    onSizeRangeChange([sizeRange[0], Math.max(max, sizeRange[0])]);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <h2>Filters</h2>
        <button type="button" className="btn" onClick={onReset}>
          Reset All Filters
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="search">Search by Name</label>
        <input
          id="search"
          type="text"
          className="field"
          placeholder="Search fossils..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="divider" />

      <div className="filter-group">
        <h3>Geological Area</h3>
        <div className="check-list">
          {availableAreas.map((area) => (
            <label key={area} className="check-item">
              <input
                type="checkbox"
                checked={selectedAreas.includes(area)}
                onChange={() => toggleArea(area)}
              />
              <span>{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="divider" />

      <div className="filter-group">
        <h3>Date Found</h3>
        <div className="range-row">
          <input
            type="number"
            min={1800}
            max={2026}
            className="field field-small"
            value={dateRange.start}
            onChange={(event) =>
              onDateRangeChange({ ...dateRange, start: Number(event.target.value) })
            }
          />
          <span>to</span>
          <input
            type="number"
            min={1800}
            max={2026}
            className="field field-small"
            value={dateRange.end}
            onChange={(event) =>
              onDateRangeChange({ ...dateRange, end: Number(event.target.value) })
            }
          />
        </div>
      </div>

      <div className="divider" />

      <div className="filter-group">
        <h3>Size (cm)</h3>
        <div className="slider-wrap">
          <label>
            Min: {sizeRange[0]} cm
            <input
              type="range"
              min={0}
              max={maxSize}
              value={sizeRange[0]}
              onChange={(event) => handleSizeMin(event.target.value)}
            />
          </label>
          <label>
            Max: {sizeRange[1]} cm
            <input
              type="range"
              min={0}
              max={maxSize}
              value={sizeRange[1]}
              onChange={(event) => handleSizeMax(event.target.value)}
            />
          </label>
        </div>
      </div>
    </aside>
  );
}

function HomePage() {
  const [fossils, setFossils] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [dateRange, setDateRange] = useState({ start: 1800, end: 2026 });

  const maxSize = useMemo(
    () => (fossils.length > 0 ? Math.max(...fossils.map((fossil) => fossil.sizeInCm)) : 0),
    [fossils],
  );
  const [sizeRange, setSizeRange] = useState([0, maxSize]);

  const availableAreas = useMemo(() => {
    const areas = new Set(fossils.map((fossil) => fossil.geologicalArea));
    return Array.from(areas).sort();
  }, [fossils]);

  useEffect(() => {
    let isActive = true;

    const fetchFossils = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const response = await axios.get(`${API_BASE_URL}/api/fossils`);
        const items = Array.isArray(response.data) ? response.data : [];
        if (isActive) {
          setFossils(items.map(mapFossil));
        }
      } catch (error) {
        if (isActive) {
          setLoadError(
            error?.response?.data?.message ||
              error?.message ||
              'Unable to load fossils right now.',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchFossils();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (maxSize > 0 && sizeRange[1] === 0) {
      setSizeRange([0, maxSize]);
    }
  }, [maxSize, sizeRange]);

  const filteredFossils = useMemo(
    () =>
      fossils.filter((fossil) => {
        const matchesSearch =
          searchTerm === '' ||
          fossil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fossil.scientificName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesArea =
          selectedAreas.length === 0 || selectedAreas.includes(fossil.geologicalArea);

        const year = Number.parseInt(fossil.dateFound, 10);
        const matchesDate =
          Number.isNaN(year) || (year >= dateRange.start && year <= dateRange.end);
        const matchesSize =
          fossil.sizeInCm >= sizeRange[0] && fossil.sizeInCm <= sizeRange[1];

        return matchesSearch && matchesArea && matchesDate && matchesSize;
      }),
    [fossils, searchTerm, selectedAreas, dateRange, sizeRange],
  );

  const handleReset = () => {
    setSearchTerm('');
    setSelectedAreas([]);
    setDateRange({ start: 1800, end: 2026 });
    setSizeRange([0, maxSize]);
  };

  return (
    <div className="app-layout">
      <FilterSidebar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedAreas={selectedAreas}
        onAreasChange={setSelectedAreas}
        availableAreas={availableAreas}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        sizeRange={sizeRange}
        onSizeRangeChange={setSizeRange}
        maxSize={maxSize}
        onReset={handleReset}
      />

      <section className="content">
        <header className="content-head">
          <h1>Remarkable Fossils</h1>
          <p>Explore our extraordinary collection of prehistoric treasures from around the world</p>
          <small>
            Showing {filteredFossils.length} of {fossils.length} fossils
          </small>
        </header>

        <main className="content-main">
          {isLoading ? (
            <div className="empty-state">
              <h3>Loading fossils...</h3>
              <p>Fetching data from the API.</p>
            </div>
          ) : loadError ? (
            <div className="empty-state">
              <h3>Unable to load fossils</h3>
              <p>{loadError}</p>
            </div>
          ) : filteredFossils.length > 0 ? (
            <div className="fossil-grid">
              {filteredFossils.map((fossil) => (
                <FossilCard key={fossil.id} fossil={fossil} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No fossils found</h3>
              <p>Try adjusting your filters to see more results.</p>
            </div>
          )}
        </main>
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
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-fossil" element={<AddFossils />} />
      </Routes>
    </>
  );
}
