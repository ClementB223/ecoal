import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
    /\/$/,
    '',
);

export default function MyCollectionEdit() {
    const [fossils, setFossils] = useState([]);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchFossils = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/my-fossils`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFossils(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError(err?.response?.data?.message || 'Unable to load your fossils.');
        }
    };

    useEffect(() => {
        fetchFossils();
    }, []);

    const handleChange = (id, field, value) => {
        setFossils((prev) =>
            prev.map((fossil) => (fossil.id === id ? { ...fossil, [field]: value } : fossil)),
        );
    };

    const handleCriteriaChange = (id, field, value) => {
        setFossils((prev) =>
            prev.map((fossil) =>
                fossil.id === id
                    ? {
                        ...fossil,
                        criteria: {
                            ...(fossil.criteria || {}),
                            [field]: value,
                        },
                    }
                    : fossil,
            ),
        );
    };

    const handleSave = async (fossil) => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', fossil.name || '');
            formData.append('description', fossil.description || '');
            formData.append('is_public', fossil.is_public ? '1' : '0');
            if (fossil.geologicalEra?.name) {
                formData.append('geological_era', fossil.geologicalEra.name);
            }
            if (fossil.criteria?.size_cm != null) {
                formData.append('size_cm', String(fossil.criteria.size_cm));
            }
            if (fossil.criteria?.age_myo != null) {
                formData.append('age_myo', String(fossil.criteria.age_myo));
            }
            if (fossil.criteria?.preservation != null) {
                formData.append('preservation', String(fossil.criteria.preservation));
            }

            await axios.post(`${API_BASE_URL}/api/my-fossils/${fossil.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchFossils();
        } catch (err) {
            setError(err?.response?.data?.message || 'Unable to save fossil.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/my-fossils/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFossils((prev) => prev.filter((fossil) => fossil.id !== id));
        } catch (err) {
            setError(err?.response?.data?.message || 'Unable to delete fossil.');
        }
    };

    return (
        <div className="collection-page">
            <div className="collection-header">
                <h1>Edit your collection</h1>
                <p>Update or remove fossils in your collections.</p>
            </div>

            {error && <p className="modal-error">{error}</p>}

            <div className="collection-grid">
                {fossils.map((fossil) => (
                    <div key={fossil.id} className="collection-card edit-card">
                        <input
                            type="text"
                            value={fossil.name || ''}
                            onChange={(event) => handleChange(fossil.id, 'name', event.target.value)}
                        />
                        <textarea
                            rows={3}
                            value={fossil.description || ''}
                            onChange={(event) => handleChange(fossil.id, 'description', event.target.value)}
                        />
                        <label className="edit-field">
                            Public
                            <input
                                type="checkbox"
                                checked={Boolean(fossil.is_public)}
                                onChange={(event) => handleChange(fossil.id, 'is_public', event.target.checked)}
                            />
                        </label>
                        <label className="edit-field">
                            Size (cm)
                            <input
                                type="number"
                                value={fossil.criteria?.size_cm ?? ''}
                                onChange={(event) => handleCriteriaChange(fossil.id, 'size_cm', event.target.value)}
                            />
                        </label>
                        <label className="edit-field">
                            Age (MYO)
                            <input
                                type="number"
                                value={fossil.criteria?.age_myo ?? ''}
                                onChange={(event) => handleCriteriaChange(fossil.id, 'age_myo', event.target.value)}
                            />
                        </label>
                        <label className="edit-field">
                            Preservation
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={fossil.criteria?.preservation ?? ''}
                                onChange={(event) =>
                                    handleCriteriaChange(fossil.id, 'preservation', event.target.value)
                                }
                            />
                        </label>
                        <div className="edit-actions">
                            <button type="button" className="modal-submit" onClick={() => handleSave(fossil)}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                className="modal-submit danger"
                                onClick={() => handleDelete(fossil.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}