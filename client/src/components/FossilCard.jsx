import './FossilCard.css';

export default function FossilCard({ fossil, onMoreClick }) {
  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick(fossil);
    }
  };

  return (
    <article className="fossil-card">
      <div className="fossil-card-media">
        <img src={fossil.image} alt={fossil.name} className="fossil-card-image" />
        <button type="button" className="fossil-card-more" onClick={handleMoreClick}>
          More
        </button>
      </div>

      <div className="fossil-card-body">
        <h3>{fossil.name}</h3>
        <p>{fossil.description}</p>

        <div className="fossil-card-rule" />

        <ul className="fossil-card-meta">
          <li>
            <span className="material-symbols-outlined fossil-icon" aria-hidden="true">
              straighten
            </span>
            <span>Size {fossil.sizeLabel}</span>
          </li>
          <li>
            <span className="material-symbols-outlined fossil-icon" aria-hidden="true">
              calendar_month
            </span>
            <span>Date {fossil.dateFound}</span>
          </li>
          <li>
            <span className="material-symbols-outlined fossil-icon" aria-hidden="true">
              public
            </span>
            <span>Continent {fossil.location}</span>
          </li>
        </ul>
      </div>
    </article>
  );
}
