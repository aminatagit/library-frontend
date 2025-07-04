// components/BookComments.js
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BookComments({ bookId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/books/${bookId}/comments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Debug: affiche la réponse reçue
        console.log('Commentaires reçus pour le livre', bookId, res.data);
        setComments(res.data);
      } catch (err) {
        setError('Error fetching comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [bookId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;
  if (!comments.length) return <p>No comments for this book.</p>;

  return (
    <div className="mt-2">
      <h4 className="font-semibold mb-1">Comments:</h4>
      <ul className="list-disc list-inside space-y-1">
        {comments.map((c, idx) => (
          <li key={idx} className="text-sm text-gray-700 bg-gray-100 rounded px-2 py-1">
            {c.comment ? (
              <>
                {c.comment} <span className="text-xs text-gray-400">- {c.author || 'Anonymous'}</span>
              </>
            ) : (
              <span className="text-xs text-red-400">{JSON.stringify(c)}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
