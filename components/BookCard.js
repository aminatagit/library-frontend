// components/BookCard.js
import { useRouter } from 'next/navigation';
import StarRating from './StarRating';

export default function BookCard({ book }) {
  const router = useRouter();

  return (
    <div className="card w-80 bg-base-100 shadow-xl m-4 hover:scale-105 transition-transform">
      <div className="card-body">
        <h2 className="card-title text-libraryPrimary">{book.title}</h2>
        <p>Auteur : {book.author}</p>
        <p>Genre : {book.genre || 'N/A'}</p>
        <div className="flex items-center gap-2 mb-1">
          <span>Note :</span>
          {book.rating !== undefined ? (
            <>
              <StarRating rating={book.rating} />
              <span className="ml-1 text-sm text-gray-500">({book.rating.toFixed(1)})</span>
            </>
          ) : (
            <span>N/A</span>
          )}
        </div>
        <p>Emprunts : {book.borrowCount !== undefined ? book.borrowCount : 0}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => router.push(`/books/${book.id}`)}
          >
            Voir le détail
          </button>
        </div>
      </div>
    </div>
  );
}