import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './FossilDetail.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
);

const DEFAULT_DB_IMAGE = `${API_BASE_URL}/uploads/fossil-default.svg`;

const resolveImageUrl = (value) => {
  if (!value) {
    return DEFAULT_DB_IMAGE;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${API_BASE_URL}/${String(value).replace(/^\/+/, '')}`;
};

const formatAgeLabel = (ageMyo, fallback) => {
  if (Number.isFinite(ageMyo) && ageMyo > 0) {
    return `${ageMyo} MYO`;
  }
  return fallback || 'Unknown';
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
  const dateFoundLabel = fossil?.date_found ?? fossil?.dateFound ?? 'Unknown';

  return {
    id: String(fossil?.id ?? ''),
    name: fossil?.name ?? 'Unknown fossil',
    description: fossil?.description ?? 'No description available.',
    era: geologicalEra?.name ?? 'Unknown',
    dateFound: dateFoundLabel,
    ageMyo: Number.isFinite(ageMyo) ? ageMyo : 0,
    sizeLabel: Number.isFinite(sizeCm) && sizeCm > 0 ? `${sizeCm} cm` : 'Unknown',
    preservation: Number.isFinite(preservation) ? preservation : 0,
    location:
      continent ||
      fossil?.geologicalArea ||
      fossil?.collection?.name ||
      fossil?.collection?.user?.name ||
      'Unknown',
    image: resolveImageUrl(imagePath),
  };
};

export default function FossilDetail() {
  const { fossilId } = useParams();
  const location = useLocation();
  const [fossil, setFossil] = useState(location.state?.fossil || null);
  const [isLoading, setIsLoading] = useState(!location.state?.fossil);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!fossilId) return;

    let isMounted = true;

    const loadFossilDetails = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const detailsResponse = await axios.get(`${API_BASE_URL}/api/fossils/${fossilId}`);
        const detailsData = detailsResponse?.data;

        if (isMounted && detailsData && !Array.isArray(detailsData)) {
          setFossil(mapFossil(detailsData));
          return;
        }

        const listResponse = await axios.get(`${API_BASE_URL}/api/fossils`);
        const items = Array.isArray(listResponse.data) ? listResponse.data : [];
        const matching = items.find((item) => String(item?.id) === String(fossilId));

        if (isMounted) {
          if (matching) {
            setFossil(mapFossil(matching));
          } else {
            setLoadError('Fossil not found.');
          }
        }
      } catch {
        try {
          const listResponse = await axios.get(`${API_BASE_URL}/api/fossils`);
          const items = Array.isArray(listResponse.data) ? listResponse.data : [];
          const matching = items.find((item) => String(item?.id) === String(fossilId));

          if (isMounted) {
            if (matching) {
              setFossil(mapFossil(matching));
            } else {
              setLoadError('Fossil not found.');
            }
          }
        } catch (error) {
          if (isMounted) {
            setLoadError(
              error?.response?.data?.message || error?.message || 'Unable to load fossil details.',
            );
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFossilDetails();

    return () => {
      isMounted = false;
    };
  }, [fossilId]);

  if (isLoading) {
    return (
      <div className="fossil-detail-page">
        <div className="status-box">Loading fossil details...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="fossil-detail-page">
        <div className="status-box">{loadError}</div>
      </div>
    );
  }

  if (!fossil) {
    return (
      <div className="fossil-detail-page">
        <div className="status-box">No fossil available.</div>
      </div>
    );
  }

  const stats = [
    { icon: 'layers', label: 'Era', value: fossil.era },
    { icon: 'hourglass_top', label: 'Age', value: formatAgeLabel(fossil.ageMyo, fossil.dateFound) },
    { icon: 'straighten', label: 'Size', value: fossil.sizeLabel },
    { icon: 'public', label: 'Location', value: fossil.location },
    { icon: 'star', label: 'Preservation', value: formatPreservationLabel(fossil.preservation) },
    { icon: 'calendar_month', label: 'Found', value: fossil.dateFound },
  ];

  return (
    <div className="fossil-detail-page">
      <section className="fossil-detail-hero">
        <div className="fossil-detail-image-wrap">
          <img src={fossil.image} alt={fossil.name} className="fossil-detail-image" />
          <span className="fossil-detail-era">{fossil.era}</span>
        </div>

        <div className="fossil-detail-info">
          <span className="fossil-detail-eyebrow">Fossil record</span>
          <h1>{fossil.name}</h1>
          <p className="fossil-detail-lead">{fossil.description}</p>

          <div className="fossil-detail-divider" />

          <ul className="fossil-detail-meta-grid">
            {stats.map((item) => (
              <li key={`${item.label}-${item.value}`}>
                <span className="material-symbols-outlined" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="fossil-detail-description">
        <h2>Description</h2>
        <p>{fossil.description}</p>
      </section>
    </div>
  );
}
