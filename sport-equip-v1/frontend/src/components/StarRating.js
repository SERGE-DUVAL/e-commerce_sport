import React from 'react';

const StarRating = ({ rating, interactive = false, onRate = null }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="star-rating">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-muted">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  if (interactive) {
    return (
      <div className="star-rating-interactive">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star-rating ${star <= rating ? 'text-warning' : 'text-muted'}`}
            style={{ cursor: 'pointer', fontSize: '1.5rem' }}
            onClick={() => onRate && onRate(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  return <div className="star-rating">{renderStars()}</div>;
};

export default StarRating;
