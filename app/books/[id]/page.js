// app/books/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

export default function BookDetails() {
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [borrowing, setBorrowing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'));
    }
  }, []);
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error('Error fetching book:', err.message);
      }
    };
    fetchBook();
  }, [id]);

  const handleRatingSubmit = async () => {
    try {
      await axios.post(
        'http://localhost:4000/api/ratings',
        { book_id: id, rating, comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Note envoyée !');
      setRating('');
      setComment('');
    } catch (err) {
      alert("Erreur lors de l'envoi de la note : " + err.message);
    }
  };

  const [borrowMessage, setBorrowMessage] = useState('');
  const [returnDate, setReturnDate] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const handleBorrow = async () => {
    try {
      setBorrowing(true);
      await axios.post(
        'http://localhost:4000/api/borrows',
        { book_id: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      // Calcule la date de retour exacte (dans 2 minutes)
      const now = new Date();
      const returnAt = new Date(now.getTime() + 2 * 60 * 1000);
      setReturnDate(returnAt);
      setBorrowMessage('');
      setCountdown(120);
      alert('Livre emprunté !');
    } catch (err) {
      alert("Erreur lors de l'emprunt : " + err.message);
    } finally {
      setBorrowing(false);
    }
  };

  // Gestion du compte à rebours
  useEffect(() => {
    if (!returnDate) return;
    setBorrowMessage('');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((returnDate - now) / 1000));
      setCountdown(diff);
      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [returnDate]);

  if (!book) return <div>Chargement du livre...</div>;

  return (
    <div className="card w-full max-w-2xl bg-base-100 shadow-xl m-4 mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl text-libraryPrimary">{book.title}</h2>
        <p><strong>Auteur :</strong> {book.author}</p>
        <p><strong>Genre :</strong> {book.genre || 'N/A'}</p>
        {isLoggedIn && (
          <>
            <button className="btn btn-secondary mt-4" onClick={handleBorrow} disabled={borrowing}>
              {borrowing ? 'Emprunt en cours...' : 'Emprunter ce livre'}
            </button>
            {(returnDate || borrowMessage) && (
              <div className="flex items-center gap-2 mt-4 text-red-600 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {returnDate ? (
                  <span>
                    Retour avant{' '}
                    <span className="font-bold text-green-700">
                      {returnDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {' '}({Math.floor(countdown/60)}:{(countdown%60).toString().padStart(2,'0')} restantes)
                    <br />
                    <span className="text-xs text-gray-500">Un mail de notification vous sera envoyé en cas de retard.</span>
                  </span>
                ) : (
                  <span>{borrowMessage}</span>
                )}
              </div>
            )}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Note (1-5) :</span>
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="input input-bordered"
              />
              <label className="label">
                <span className="label-text">Commentaire :</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="textarea textarea-bordered"
              ></textarea>
              <button className="btn btn-primary mt-4" onClick={handleRatingSubmit}>
                Envoyer ma note
              </button>
            </div>
          </>
        )}
        <button className="btn btn-ghost mt-4" onClick={() => router.push('/')}> 
          Retour &agrave; l&apos;accueil
        </button>
      </div>
    </div>
  );
}