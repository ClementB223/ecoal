import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getMe } from '../services/AuthServices';
import '../App.css';
import './Collections.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
    /\/$/,
    '',
);

export default function Collections() {
    const [collections, setCollections] = useState([]);
    const [myCollectionId, setMyCollectionId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCollections = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/collections`);
                setCollections(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setError(err?.response?.data?.message || 'Unable to load collections.');
            }
        };

        const loadMe = async () => {
            try {
                const me = await getMe();
                setMyCollectionId(me?.collection?.id ?? null);
            } catch {
                setMyCollectionId(null);
            }
        };

        loadCollections();
        loadMe();
    }, []);

    return (
        <div className="collection-page">
            <div className="collection-header">
                <h1>Collections</h1>
                <p>Browse fossil collections and explore the entries inside each one.</p>
                {myCollectionId && (
                    <Link to="/collection/me" className="edit-collection-button">
                        Edit your collections
                    </Link>
                )}
            </div>

            {error && <p className="modal-error">{error}</p>}

            <div className="collection-grid">
                {collections.map((collection) => (
                    <Link
                        key={collection.id}
                        to={`/collection/${collection.id}`}
                        className="collection-card"
                    >
                        <h3>{collection.name}</h3>
                        <p>Owner: {collection.user?.name || 'Unknown'}</p>
                        <span>Open collection</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
