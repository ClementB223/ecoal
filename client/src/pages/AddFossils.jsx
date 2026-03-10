import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getMe } from '../services/AuthServices';
import '../App.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
);

export default function AddFossils() {
  const [collectionName, setCollectionName] = useState('');
  const [geologicalEras, setGeologicalEras] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [geologicalEra, setGeologicalEra] = useState('');
  const [sizeCm, setSizeCm] = useState('');
  const [ageMyo, setAgeMyo] = useState('');
  const [preservation, setPreservation] = useState('3');
  const [isPublic, setIsPublic] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const previewUrl = useMemo(() => {
    if (!imageFile) return '';
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const me = await getMe();
        setCollectionName(me?.collection?.name || '');
      } catch {
        setCollectionName('');
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/geological-eras`);
        setGeologicalEras(Array.isArray(res.data) ? res.data : []);
      } catch {
        setGeologicalEras([]);
      }
    };

    loadMeta();

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
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
      formData.append('size_cm', sizeCm);
      formData.append('age_myo', ageMyo);
      formData.append('preservation', preservation);
      formData.append('is_public', isPublic ? '1' : '0');
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
      <div className="add-fossil-card">
        <div className="add-fossil-header">
          <h1>Add Fossil</h1>
          <p>Create a new fossil entry linked to your collection.</p>
        </div>

        <form className="add-fossil-form" onSubmit={handleSubmit}>
          <label>
            Collection
            <input type="text" value={collectionName} readOnly placeholder="Your collection" />
          </label>

          <label>
            Fossil name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label>
            Description
            <textarea
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <div className="add-fossil-grid">
            <label>
              Geo era
              <select
                value={geologicalEra}
                onChange={(event) => setGeologicalEra(event.target.value)}
                required
              >
                <option value="">Select an era</option>
                {geologicalEras.map((era) => (
                  <option key={era.id} value={era.name}>
                    {era.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Size (cm)
              <input
                type="number"
                min="0"
                step="0.01"
                value={sizeCm}
                onChange={(event) => setSizeCm(event.target.value)}
                required
              />
            </label>

            <label>
              Date found (MYO)
              <input
                type="number"
                min="0"
                step="0.01"
                value={ageMyo}
                onChange={(event) => setAgeMyo(event.target.value)}
                required
              />
            </label>

            <label>
              Preservation (1-5)
              <select
                value={preservation}
                onChange={(event) => setPreservation(event.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </label>
          </div>

          <label className="add-fossil-toggle">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(event) => setIsPublic(event.target.checked)}
            />
            Public listing
          </label>

          <label className="add-fossil-upload">
            Upload image
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {previewUrl && (
            <div className="add-fossil-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}

          {error && <p className="modal-error">{error}</p>}

          <button type="submit" className="modal-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save fossil'}
          </button>
        </form>
      </div>
    </div>
  );
}
