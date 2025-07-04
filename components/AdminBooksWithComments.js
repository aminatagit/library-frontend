// components/AdminBooksWithComments.js
'use client';

import axios from 'axios';
import { useState as useLocalState, useEffect as useLocalEffect } from 'react';

export default function AdminBooksWithComments() {
  const [books, setBooks] = useLocalState([]);
  const [loading, setLoading] = useLocalState(true);
  const [error, setError] = useLocalState(null);
  const [booksWithComments, setBooksWithComments] = useLocalState([]);

  useLocalEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/books', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBooks(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des livres');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useLocalEffect(() => {
    // Pour chaque livre, on va chercher les commentaires et on ne garde que ceux qui en ont
    const fetchAllComments = async () => {
      if (!books.length) return;
      const results = await Promise.all(
        books.map(async (book) => {
          try {
            const res = await axios.get(`http://localhost:4000/api/books/${book.id}/comments`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (Array.isArray(res.data) && res.data.length > 0) {
              return { ...book, comments: res.data };
            }
            return null;
          } catch {
            return null;
          }
        })
      );
      setBooksWithComments(results.filter(Boolean));
    };
    fetchAllComments();
  }, [books]);


  if (loading) return <div className="flex justify-center items-center h-32"><span className="text-gray-500">Chargement des livres...</span></div>;
  if (error) return <div className="flex justify-center items-center h-32"><span className="text-red-500">{error}</span></div>;
  if (!booksWithComments.length) return <div className="flex justify-center items-center h-32"><span className="text-gray-500">Aucun livre avec commentaire trouvé.</span></div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-left text-libraryPrimary">Livres avec commentaires</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {booksWithComments.map((book) => (
          <div key={book.id} className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">par {book.author}</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {book.comments.map((c, idx) => {
                const author = c.author === 'testcopilot' ? 'Aminata Ouedraogo' : (c.author || 'Anonyme');
                return (
                  <li key={idx} className="text-sm text-gray-700 bg-gray-100 rounded px-2 py-1">
                    {c.comment ? c.comment : <span className="italic text-gray-400">(Commentaire vide)</span>} <span className="text-xs text-gray-400">- {author}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
