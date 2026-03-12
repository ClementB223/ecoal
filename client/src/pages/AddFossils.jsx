import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FossilCard from '../components/FossilCard';
import './AddFossils.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
);

const getEraDefaultAgeMyo = (eraName) => {
  const value = (eraName || '').toLowerCase();
  if (value.includes('paleo')) return 500;
  if (value.includes('meso')) return 170;
  if (value.includes('ceno')) return 20;
  return 100;
};

export default function AddFossils() {
  const [geologicalEras, setGeologicalEras] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [geologicalEra, setGeologicalEra] = useState('');
  const [sizeCm, setSizeCm] = useState('8');
  const [ageMyo, setAgeMyo] = useState('100');
  const [continent, setContinent] = useState('Europe');
  const [preservation, setPreservation] = useState('3');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const estimatedAgeMyo = useMemo(() => getEraDefaultAgeMyo(geologicalEra), [geologicalEra]);

  const previewUrl = useMemo(() => {
    if (!imageFile) return '';
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  const eraOptions = useMemo(() => {
    const names = geologicalEras.map((era) => era?.name).filter(Boolean);
    if (names.length > 0) return names.slice(0, 3);
    return ['Paleozoic', 'Mesozoic', 'Cenozoic'];
  }, [geologicalEras]);

  const previewFossil = useMemo(
    () => ({
      id: 'preview',
      name: name || 'Velociraptor',
      description: description || 'Description fle nszk n skzjsl lorem ipsum',
      sizeLabel: sizeCm ? `${sizeCm} cm` : 'Unknown',
      dateFound: ageMyo ? `${ageMyo} MYO` : 'Unknown',
      location: continent,
      era: geologicalEra || 'Unknown',
      preservation: Number(preservation),
      image: previewUrl || `${API_BASE_URL}/uploads/fossil-default.svg`,
    }),
    [ageMyo, continent, description, geologicalEra, name, preservation, previewUrl, sizeCm],
  );

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/geological-eras`);
        const list = Array.isArray(res.data) ? res.data : [];
        setGeologicalEras(list);
        if (list.length > 0) {
          const firstEraName = list[0]?.name || '';
          setGeologicalEra((current) => current || firstEraName);
          setAgeMyo((current) => current || String(getEraDefaultAgeMyo(firstEraName)));
        }
      } catch {
        setGeologicalEras([]);
        setGeologicalEra((current) => current || 'Paleozoic');
        setAgeMyo((current) => current || String(getEraDefaultAgeMyo('Paleozoic')));
      }
    };

    loadMeta();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handlePreservationChange = (rawValue) => {
    const parsed = Number.parseInt(rawValue, 10);
    if (Number.isNaN(parsed)) {
      setPreservation('0');
      return;
    }

    const clamped = Math.max(0, Math.min(5, parsed));
    setPreservation(String(clamped));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('geological_era', geologicalEra);
      formData.append('size_cm', String(sizeCm || 0));
      formData.append('age_myo', String(ageMyo || 0));
      formData.append('preservation', String(preservation || 0));
      formData.append('continent', continent);
      formData.append('is_public', '1');
      if (imageFile) {
        formData.append('image', imageFile, imageFile.name);
      }

      await axios.post(`${API_BASE_URL}/api/my-fossils`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsSubmitting(false);
      navigate('/');
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.response?.data?.message || 'Unable to add fossil.');
    }
  };

  return (
    <div className="add-fossil-page">
      <h1>Add a Fossil in your own collection</h1>
      <div className="add-fossil-shell">
        <form className="add-fossil-form" onSubmit={handleSubmit}>
          <div className="add-fossil-main">
            <label className="add-fossil-field">
              <span>Fossils</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name of fossils"
                required
              />
            </label>

            <label className="add-fossil-field">
              <span>Description</span>
              <textarea
                rows={2}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
              />
            </label>

            <div className="add-fossil-choices">
              <div className="add-fossil-choice-card add-fossil-choice-card--metrics">
                <h3>Metrics</h3>
                <label className="add-fossil-field add-fossil-field--compact">
                  <span>Size (cm)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={sizeCm}
                    onChange={(event) => setSizeCm(event.target.value)}
                    placeholder="8"
                    required
                  />
                </label>
                <label className="add-fossil-field add-fossil-field--compact">
                  <span>Date found</span>
                  <div className="add-fossil-inline-unit">
                    <input
                      type="number"
                      step="0.1"
                      value={ageMyo}
                      onChange={(event) => setAgeMyo(event.target.value)}
                      placeholder={String(estimatedAgeMyo)}
                      required
                    />
                    <span className="add-fossil-unit">MYO</span>
                  </div>
                </label>
              </div>

              <div className="add-fossil-choice-card">
                <h3>Era</h3>
                {eraOptions.map((era) => (
                  <label key={era} className="add-fossil-option">
                    <input
                      type="checkbox"
                      checked={geologicalEra === era}
                      onChange={() => {
                        setGeologicalEra(era);
                        setAgeMyo(String(getEraDefaultAgeMyo(era)));
                      }}
                    />
                    <span>{era}</span>
                  </label>
                ))}
              </div>

              <div className="add-fossil-side-fields">
                <label className="add-fossil-field add-fossil-field--continent">
                  <span>Continent</span>
                  <select value={continent} onChange={(event) => setContinent(event.target.value)}>
                    <option value="Europe">Europe</option>
                    <option value="Africa">Africa</option>
                    <option value="Asia">Asia</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Oceania">Oceania</option>
                  </select>
                </label>

                <label className="add-fossil-field add-fossil-field--preservation">
                  <span>Preservation (0-5)</span>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="1"
                    value={preservation}
                    onChange={(event) => handlePreservationChange(event.target.value)}
                    placeholder="3"
                    required
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="add-fossil-side">
            <label className="add-fossil-upload">
              <span>Image fossils</span>
              <div className="add-fossil-dropzone">
                <span className="material-symbols-outlined" aria-hidden="true">
                  image
                </span>
                <p>Drag and drop or click to upload</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>

            <div className="add-fossil-preview">
              <h3>Preview</h3>
              <FossilCard fossil={previewFossil} />
            </div>

            {error && <p className="add-fossil-error">{error}</p>}

            <button type="submit" className="add-fossil-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'ADD FOSILS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
