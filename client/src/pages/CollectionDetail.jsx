import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
    /\/$/,
    '',
);

export default function CollectionDetail() {
    const { id } = useParams();
    const [collection, setCollection] = useState(null);
    const [fossils, setFossils] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDetail = async () => {
            try {
                const [collectionRes, fossilsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/collections/${id}`),
                    axios.get(`${API_BASE_URL}/api/collections/${id}/fossils`),
                ]);

                setCollection(collectionRes.data || null);
                setFossils(Array.isArray(fossilsRes.data) ? fossilsRes.data : []);
            } catch (err) {
                setError(err?.response?.data?.message || 'Unable to load collection.');
            }
        };

        loadDetail();
    }, [id]);

    return (
        <div className="collection-page">
            <div className="collection-header">
                <h1>{collection?.name || 'Collection'}</h1>
                <p>Owner: {collection?.user?.name || 'Unknown'}</p>
            </div>

            {error && <p className="modal-error">{error}</p>}

            <div className="collection-grid">
                {fossils.map((fossil) => (
                    <div key={fossil.id} className="collection-card">
                        <h3>{fossil.name}</h3>
                        <p>{fossil.description || 'No description'}</p>
                        <span>Eras: {fossil.geologicalEra?.name || 'Unknown'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}