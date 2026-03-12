import './FossilCard.css';

export default function FossilCard({ fossil, onMoreClick, meta }) {
  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick(fossil);
    }
  };

  const defaultMeta = [
    { icon: 'straighten', label: 'Size', value: fossil.sizeLabel },
    { icon: 'calendar_month', label: 'Date', value: fossil.dateFound },
    { icon: 'public', label: 'Continent', value: fossil.location },
  ];

  const metaItems = Array.isArray(meta) && meta.length > 0 ? meta : defaultMeta;

  return (
    <article className="fossil-card">
      <div className="fossil-card-media">
        <img src={fossil.image} alt={fossil.name} className="fossil-card-image" />
        {onMoreClick && (
          <button type="button" className="fossil-card-more" onClick={handleMoreClick}>
            More
          </button>
        )}
      </div>

      <div className="fossil-card-body">
        <h3>{fossil.name}</h3>
        <p>{fossil.description}</p>

        <div className="fossil-card-rule" />

        <ul className="fossil-card-meta">
          {metaItems.map((item) => (
            <li key={`${item.label}-${item.value}`}>
              <span className="material-symbols-outlined fossil-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>
                {item.label} {item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
