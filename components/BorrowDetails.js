// components/BorrowDetails.js
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BorrowDetails({ borrow, user, onReturn }) {
  const [myComment, setMyComment] = useState(null);
  const [myRating, setMyRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!borrow.bookId && !borrow.book?.id) return;
        const bookId = borrow.bookId || borrow.book?.id;
        const res = await axios.get(`http://localhost:4000/api/books/${bookId}/comments`);
        // On cherche le commentaire de l'utilisateur courant
        const userComment = res.data.find(
          (c) => c.author === user.username || c.author === user.email || c.user === user.username || c.user === user.email
        );
        setMyComment(userComment?.comment || null);
        setMyRating(userComment?.rating || null);
      } catch {
        setMyComment(null);
        setMyRating(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [borrow, user]);

  if (loading) return (
    <tr>
      <td colSpan={6} className="text-center text-gray-400">Loading...</td>
    </tr>
  );

  // Si aucune info sur le livre, on n'affiche pas la ligne
  if (!borrow.bookTitle && !borrow.book?.title) return null;

  // Date de retour : 2 minutes après l'emprunt
  const returnDate = fixedReturnDate(borrow.borrowedAt);
  const isLate = borrow.borrowedAt && new Date(returnDate) < new Date();

  // (supprimé, déjà déclaré en haut)
  const handleReturn = async () => {
    if (!window.confirm('Confirmer la remise du livre ?')) return;
    setReturning(true);
    try {
      await axios.delete(`http://localhost:4000/api/borrows/return/${borrow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (onReturn) onReturn(borrow.id);
    } catch (err) {
      alert("Erreur lors de la remise : " + err.message);
    } finally {
      setReturning(false);
    }
  };
  return (
    <tr className={isLate ? 'bg-red-100' : ''}>
      <td className="text-sm">{borrow.bookTitle || borrow.book?.title}</td>
      <td className="text-sm">{borrow.borrowedAt ? new Date(borrow.borrowedAt).toLocaleDateString() : 'N/A'}</td>
      <td className="text-sm">
        {returnDate}
        {isLate && (
          <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded">En retard</span>
        )}
      </td>
      <td className="text-sm">{myComment || '—'}</td>
      <td className="text-sm">{myRating !== null ? myRating : '—'}</td>
      <td>
        <button className="btn btn-xs btn-success min-w-[120px] px-3 py-1 text-sm font-semibold" style={{whiteSpace:'nowrap'}} onClick={handleReturn} disabled={returning}>
          {returning ? 'Remise...' : 'Remettre le livre'}
        </button>
      </td>
    </tr>
  );
}

// Retour dans 2 minutes après la date d'emprunt
function fixedReturnDate(borrowedAt) {
  if (!borrowedAt) return 'N/A';
  const base = new Date(borrowedAt);
  base.setMinutes(base.getMinutes() + 2);
  return base.toLocaleDateString() + ' ' + base.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
