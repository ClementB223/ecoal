import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FossilCard from '../components/FossilCard';
import '../App.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
    /\/$/,
    '',
);

const DEFAULT_DB_IMAGE = `${API_BASE_URL}/uploads/fossil-default.svg`;

const resolveImageUrl = (value) => {
    if (!value) return DEFAULT_DB_IMAGE;
    if (/^https?:\/\//i.test(value)) return value;
    return `${API_BASE_URL}/${String(value).replace(/^\/+/, '')}`;
};

const mapFossil = (fossil) => {
    const criteria = fossil?.criteria || {};
    const era = fossil?.geologicalEra?.name || fossil?.geological_era?.name || 'Unknown';
    const sizeCm = Number(criteria.size_cm ?? fossil?.size_cm ?? 0);
    const ageMyo = Number(criteria.age_myo ?? fossil?.age_myo ?? 0);
    const preservation = Number(criteria.preservation ?? fossil?.preservation ?? 0);
    const imagePath = fossil?.image_url || fossil?.image_path;

    return {
        id: String(fossil?.id ?? ''),
        name: fossil?.name ?? 'Unknown fossil',
        description: fossil?.description ?? 'No description',
        image: resolveImageUrl(imagePath),
        sizeLabel: Number.isFinite(sizeCm) && sizeCm > 0 ? `${sizeCm} cm` : 'Unknown',
        ageLabel: Number.isFinite(ageMyo) && ageMyo > 0 ? `${ageMyo} MYO` : 'Unknown',
        preservationLabel:
            Number.isFinite(preservation) && preservation > 0 ? `${preservation}/5` : 'Unknown',
        era,
    };
};

export default function CollectionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
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
                setFossils(
                    Array.isArray(fossilsRes.data) ? fossilsRes.data.map(mapFossil) : [],
                );
            } catch (err) {
                setError(err?.response?.data?.message || 'Unable to load collection.');
            }
        };

        loadDetail();
    }, [id]);

    const openFossilDetails = (fossil) => {
        navigate(`/fossils/${fossil.id}`);
    };

    return (
        <div className="collection-page">
            <div className="collection-header">
                <h1>{collection?.name || 'Collection'}</h1>
                <p>Owner: {collection?.user?.name || 'Unknown'}</p>
            </div>

            {error && <p className="modal-error">{error}</p>}

            <div className="collection-grid">
                {fossils.map((fossil) => (
                    <FossilCard
                        key={fossil.id}
                        fossil={fossil}
                        onMoreClick={openFossilDetails}
                        meta={[
                            { icon: 'straighten', label: 'Size :', value: fossil.sizeLabel },
                            { icon: 'hourglass_top', label: 'Age :', value: fossil.ageLabel },
                            { icon: 'star', label: 'Preservation :', value: fossil.preservationLabel },
                            { icon: 'layers', label: 'Era :', value: fossil.era },
                        ]}
                    />
                ))}
            </div>
        </div>
    );
}
