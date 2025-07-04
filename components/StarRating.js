// components/StarRating.js
'use client';

export default function StarRating({ rating = 0, max = 5 }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = max - fullStars - (halfStar ? 1 : 0);

  return (
    <span className="text-yellow-400 text-lg align-middle">
      {Array(fullStars).fill().map((_, i) => <span key={'f'+i}>★</span>)}
      {halfStar && <span>☆</span>}
      {Array(emptyStars).fill().map((_, i) => <span key={'e'+i}>☆</span>)}
    </span>
  );
}
