import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import './MyCollectionEdit.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
    /\/$/,
    '',
);
const DEFAULT_IMAGE = `${API_BASE_URL}/uploads/fossil-default.svg`;

const resolveImageUrl = (value) => {
    if (!value) return DEFAULT_IMAGE;
    if (/^https?:\/\//i.test(value)) return value;
    return `${API_BASE_URL}/${String(value).replace(/^\/+/, '')}`;
};

export default function MyCollectionEdit() {
    const [fossils, setFossils] = useState([]);
    const [geologicalEras, setGeologicalEras] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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

    useEffect(() => {
        const loadEras = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/geological-eras`);
                const list = Array.isArray(res.data) ? res.data : [];
                setGeologicalEras(list);
            } catch {
                setGeologicalEras([]);
            }
        };

        loadEras();
    }, []);

    useEffect(() => {
        if (!error && !success) return;
        const timeout = setTimeout(() => {
            setError('');
            setSuccess('');
        }, 3000);
        return () => clearTimeout(timeout);
    }, [error, success]);

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

    const handleEraChange = (id, value) => {
        setFossils((prev) =>
            prev.map((fossil) =>
                fossil.id === id
                    ? {
                        ...fossil,
                        geologicalEra: {
                            ...(fossil.geologicalEra || {}),
                            name: value,
                        },
                    }
                    : fossil,
            ),
        );
    };

    const handleSave = async (fossil) => {
        setIsSaving(true);
        setError('');
        setSuccess('');
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
            if (fossil.imageFile) {
                formData.append('image', fossil.imageFile, fossil.imageFile.name);
            }

            await axios.post(`${API_BASE_URL}/api/my-fossils/${fossil.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchFossils();
            setSuccess('Successfully edited.');
        } catch (err) {
            setError(err?.response?.data?.message || 'Error editing fossil.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageChange = (id, file) => {
        if (!file) return;

        setFossils((prev) =>
            prev.map((fossil) => {
                if (fossil.id !== id) return fossil;
                if (fossil.imagePreview?.startsWith('blob:')) {
                    URL.revokeObjectURL(fossil.imagePreview);
                }
                return {
                    ...fossil,
                    imageFile: file,
                    imagePreview: URL.createObjectURL(file),
                };
            }),
        );
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
        <div className="edit-fossil-page">
            <div className="edit-fossil-shell">
                <div className="edit-fossil-header">
                    <h1>Edit your collection</h1>
                    <p>Update or remove fossils in your collections.</p>
                </div>

                {(error || success) && (
                    <div className={`edit-fossil-toast ${error ? 'error' : 'success'}`}>
                        {error || success}
                    </div>
                )}

                <div className="edit-fossil-grid">
                    {fossils.map((fossil) => (
                        <div key={fossil.id} className="edit-fossil-card">
                            <div className="edit-fossil-body">
                                <div className="edit-fossil-main">
                                    <label className="edit-fossil-field">
                                        <span>Fossil</span>
                                        <input
                                            type="text"
                                            value={fossil.name || ''}
                                            onChange={(event) => handleChange(fossil.id, 'name', event.target.value)}
                                        />
                                    </label>

                                    <label className="edit-fossil-field">
                                        <span>Description</span>
                                        <textarea
                                            rows={3}
                                            value={fossil.description || ''}
                                            onChange={(event) =>
                                                handleChange(fossil.id, 'description', event.target.value)
                                            }
                                        />
                                    </label>

                                    <label className="edit-fossil-field">
                                        <span>Geological era</span>
                                        <select
                                            value={fossil.geologicalEra?.name || ''}
                                            onChange={(event) => handleEraChange(fossil.id, event.target.value)}
                                        >
                                            <option value="" disabled>
                                                Select an era
                                            </option>
                                            {geologicalEras.length > 0
                                                ? geologicalEras.map((era) => (
                                                    <option key={era?.id ?? era?.name} value={era?.name || ''}>
                                                        {era?.name}
                                                    </option>
                                                ))
                                                : ['Paleozoic', 'Mesozoic', 'Cenozoic'].map((era) => (
                                                    <option key={era} value={era}>
                                                        {era}
                                                    </option>
                                                ))}
                                        </select>
                                    </label>
                                </div>

                                <div className="edit-fossil-side">
                                    <label className="edit-fossil-upload">
                                        <span>Image fossils</span>
                                        <div className="edit-fossil-dropzone">
                                            <span className="material-symbols-outlined" aria-hidden="true">
                                                image
                                            </span>
                                            <p>Drag and drop or click to upload</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) =>
                                                handleImageChange(fossil.id, event.target.files?.[0] || null)
                                            }
                                        />
                                    </label>

                                    <div className="edit-fossil-preview">
                                        <h3>Preview</h3>
                                        <img
                                            src={resolveImageUrl(
                                                fossil.imagePreview ||
                                                fossil.image_url ||
                                                fossil.image_path ||
                                                fossil.image,
                                            )}
                                            alt={fossil.name || 'Fossil'}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="edit-fossil-meta">
                                <label className="edit-fossil-toggle">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(fossil.is_public)}
                                        onChange={(event) => handleChange(fossil.id, 'is_public', event.target.checked)}
                                    />
                                    <span>Public</span>
                                </label>

                                <div className="edit-fossil-row">
                                    <label className="edit-fossil-field">
                                        <span>Size (cm)</span>
                                        <input
                                            type="number"
                                            value={fossil.criteria?.size_cm ?? ''}
                                            onChange={(event) =>
                                                handleCriteriaChange(fossil.id, 'size_cm', event.target.value)
                                            }
                                        />
                                    </label>
                                    <label className="edit-fossil-field">
                                        <span>Age (MYO)</span>
                                        <input
                                            type="number"
                                            value={fossil.criteria?.age_myo ?? ''}
                                            onChange={(event) =>
                                                handleCriteriaChange(fossil.id, 'age_myo', event.target.value)
                                            }
                                        />
                                    </label>
                                    <label className="edit-fossil-field">
                                        <span>Preservation</span>
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
                                </div>

                                <div className="edit-fossil-actions">
                                    <button
                                        type="button"
                                        className="edit-fossil-button"
                                        onClick={() => handleSave(fossil)}
                                    >
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        className="edit-fossil-button danger"
                                        onClick={() => handleDelete(fossil.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}