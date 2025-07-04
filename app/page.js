// app/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [topBooks, setTopBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        // On suppose que l'API accepte un paramètre ?topRated=true ou similaire
        const res = await axios.get('http://localhost:4000/api/books', { params: { topRated: true } });
        setTopBooks(res.data);
      } catch (err) {
        console.error('Error fetching top books:', err.message);
      }
    };
    fetchTopBooks();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="hero hero-bg text-primary-content py-24 mb-6 rounded-lg flex items-center justify-center min-h-[50vh]">
        <div className="hero-content text-center flex flex-col items-center justify-center w-full">
          <div className="max-w-2xl w-full">
            <h1 className="text-5xl font-extrabold mb-4 text-center">Bienvenue à la Médiathèque Lumière</h1>
            <p className="py-6 text-xl text-center">
              Explorez, empruntez et notez des milliers de livres.<br />
              Trouvez votre prochaine lecture ou parcourez tout notre catalogue !
            </p>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">Livres les mieux notés</h2>
      <div className="flex flex-wrap justify-center">
        {topBooks.length === 0 ? (
          <p>Aucun livre top noté trouvé.</p>
        ) : (
          topBooks.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </div>
      <div className="flex justify-center mt-8">
        <button className="btn btn-primary" onClick={() => router.push('/catalogue')}>
          Voir plus
        </button>
      </div>
    </div>
  );
}