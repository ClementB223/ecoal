import { useMemo, useState } from 'react';
import './App.css';

const fossils = [
  {
    id: '1',
    name: 'Tyrannosaurus Rex Bone',
    scientificName: 'Tyrannosaurus rex',
    geologicalArea: 'North America',
    dateFound: '1998',
    size: '145 cm',
    sizeInCm: 145,
    era: 'Mesozoic',
    period: 'Late Cretaceous',
    type: 'Dinosaur',
    image: 'https://images.unsplash.com/photo-1651980802497-2ad4b4adbb5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3NzaWwlMjBkaW5vc2F1ciUyMGJvbmV8ZW58MXx8fHwxNzczMDYyNTcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Massive femur bone from one of the largest carnivorous dinosaurs to ever exist, showing remarkable preservation.',
  },
  {
    id: '2',
    name: 'Ammonite Spiral',
    scientificName: 'Dactylioceras commune',
    geologicalArea: 'Europe',
    dateFound: '2005',
    size: '12 cm',
    sizeInCm: 12,
    era: 'Mesozoic',
    period: 'Jurassic',
    type: 'Cephalopod',
    image: 'https://images.unsplash.com/photo-1631631648709-63b2c999cb82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbW1vbml0ZSUyMGZvc3NpbCUyMHNwaXJhbHxlbnwxfHx8fDE3NzMwNjI1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Beautiful spiral shell fossil displaying intricate chambers, an extinct marine cephalopod from ancient seas.',
  },
  {
    id: '3',
    name: 'Trilobite',
    scientificName: 'Calymene blumenbachii',
    geologicalArea: 'Asia',
    dateFound: '2012',
    size: '8 cm',
    sizeInCm: 8,
    era: 'Paleozoic',
    period: 'Silurian',
    type: 'Arthropod',
    image: 'https://images.unsplash.com/photo-1622417934900-ae335a0a0726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlsb2JpdGUlMjBmb3NzaWwlMjBhbmNpZW50fGVufDF8fHx8MTc3MzA2MjU3MXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: "Exceptionally preserved trilobite showing detailed segmentation, from one of Earth's most successful ancient arthropods.",
  },
  {
    id: '4',
    name: 'Fern Leaf Impression',
    scientificName: 'Neuropteris flexuosa',
    geologicalArea: 'North America',
    dateFound: '2015',
    size: '25 cm',
    sizeInCm: 25,
    era: 'Paleozoic',
    period: 'Carboniferous',
    type: 'Plant',
    image: 'https://images.unsplash.com/photo-1672153902713-28e0a02acdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJuJTIwbGVhZiUyMGZvc3NpbHxlbnwxfHx8fDE3NzMwNjI1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Delicate fern fossil from the coal forests, showcasing intricate leaf venation patterns preserved in stone.',
  },
  {
    id: '5',
    name: 'Ancient Fish Skeleton',
    scientificName: 'Knightia eocaena',
    geologicalArea: 'North America',
    dateFound: '2008',
    size: '18 cm',
    sizeInCm: 18,
    era: 'Cenozoic',
    period: 'Eocene',
    type: 'Fish',
    image: 'https://images.unsplash.com/photo-1711076098518-0b3b8cb3b058?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3NzaWwlMjBmaXNoJTIwc2tlbGV0b258ZW58MXx8fHwxNzczMDYyNTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Complete fish fossil from ancient lake deposits, showing remarkable detail including fins and scales.',
  },
  {
    id: '6',
    name: 'Mammoth Tusk Fragment',
    scientificName: 'Mammuthus primigenius',
    geologicalArea: 'Europe',
    dateFound: '2001',
    size: '85 cm',
    sizeInCm: 85,
    era: 'Cenozoic',
    period: 'Pleistocene',
    type: 'Mammal',
    image: 'https://images.unsplash.com/photo-1765969933968-b30694385e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW1tb3RoJTIwZm9zc2lsJTIwdHVza3xlbnwxfHx8fDE3NzMwNjI1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Impressive woolly mammoth tusk showing growth rings and excellent mineral preservation from the Ice Age.',
  },
  {
    id: '7',
    name: 'Fossilized Shell',
    scientificName: 'Pecten maximus',
    geologicalArea: 'Africa',
    dateFound: '2018',
    size: '9 cm',
    sizeInCm: 9,
    era: 'Cenozoic',
    period: 'Miocene',
    type: 'Mollusk',
    image: 'https://images.unsplash.com/photo-1743769446654-0b479b4fa126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3NzaWwlMjBzaGVsbCUyMGFuY2llbnR8ZW58MXx8fHwxNzczMDYyNTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Pristine scallop shell fossil with visible growth lines and original shell texture preserved in limestone.',
  },
  {
    id: '8',
    name: 'Prehistoric Stone Fossil',
    scientificName: 'Orthoceras regulare',
    geologicalArea: 'Asia',
    dateFound: '2020',
    size: '32 cm',
    sizeInCm: 32,
    era: 'Paleozoic',
    period: 'Ordovician',
    type: 'Cephalopod',
    image: 'https://images.unsplash.com/photo-1759850426022-2c7ba6d03b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVoaXN0b3JpYyUyMGZvc3NpbCUyMHN0b25lfGVufDF8fHx8MTc3MzA2MjU3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Elongated straight-shelled nautiloid showing internal chamber structure, polished to reveal internal details.',
  },
  {
    id: '9',
    name: 'Stegosaurus Plate',
    scientificName: 'Stegosaurus stenops',
    geologicalArea: 'North America',
    dateFound: '1992',
    size: '52 cm',
    sizeInCm: 52,
    era: 'Mesozoic',
    period: 'Late Jurassic',
    type: 'Dinosaur',
    image: 'https://images.unsplash.com/photo-1651980802497-2ad4b4adbb5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3NzaWwlMjBkaW5vc2F1ciUyMGJvbmV8ZW58MXx8fHwxNzczMDYyNTcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'One of the distinctive back plates from a Stegosaurus, showing the bone structure and vascular grooves.',
  },
  {
    id: '10',
    name: 'Belemnite Rostrum',
    scientificName: 'Belemnitella americana',
    geologicalArea: 'Europe',
    dateFound: '2010',
    size: '7 cm',
    sizeInCm: 7,
    era: 'Mesozoic',
    period: 'Cretaceous',
    type: 'Cephalopod',
    image: 'https://images.unsplash.com/photo-1631631648709-63b2c999cb82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbW1vbml0ZSUyMGZvc3NpbCUyMHNwaXJhbHxlbnwxfHx8fDE3NzMwNjI1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: "Bullet-shaped internal shell from an extinct squid-like creature, often called 'thunderstones' in folklore.",
  },
  {
    id: '11',
    name: 'Crinoid Stem',
    scientificName: 'Pentacrinites fossilis',
    geologicalArea: 'Africa',
    dateFound: '2014',
    size: '15 cm',
    sizeInCm: 15,
    era: 'Mesozoic',
    period: 'Jurassic',
    type: 'Echinoderm',
    image: 'https://images.unsplash.com/photo-1622417934900-ae335a0a0726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlsb2JpdGUlMjBmb3NzaWwlMjBhbmNpZW50fGVufDF8fHx8MTc3MzA2MjU3MXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Segmented stem from a sea lily, showing the distinctive stacked disc-like structure of this ancient animal.',
  },
  {
    id: '12',
    name: 'Saber-Toothed Cat Canine',
    scientificName: 'Smilodon fatalis',
    geologicalArea: 'South America',
    dateFound: '2003',
    size: '22 cm',
    sizeInCm: 22,
    era: 'Cenozoic',
    period: 'Pleistocene',
    type: 'Mammal',
    image: 'https://images.unsplash.com/photo-1765969933968-b30694385e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW1tb3RoJTIwZm9zc2lsJTIwdHVza3xlbnwxfHx8fDE3NzMwNjI1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Iconic elongated canine tooth from the famous ice age predator, showing wear patterns from hunting.',
  },
];

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

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [dateRange, setDateRange] = useState({ start: 1800, end: 2026 });

  const maxSize = useMemo(() => Math.max(...fossils.map((fossil) => fossil.sizeInCm)), []);
  const [sizeRange, setSizeRange] = useState([0, maxSize]);

  const availableAreas = useMemo(() => {
    const areas = new Set(fossils.map((fossil) => fossil.geologicalArea));
    return Array.from(areas).sort();
  }, []);

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
        const matchesDate = year >= dateRange.start && year <= dateRange.end;
        const matchesSize =
          fossil.sizeInCm >= sizeRange[0] && fossil.sizeInCm <= sizeRange[1];

        return matchesSearch && matchesArea && matchesDate && matchesSize;
      }),
    [searchTerm, selectedAreas, dateRange, sizeRange],
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
          {filteredFossils.length > 0 ? (
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
