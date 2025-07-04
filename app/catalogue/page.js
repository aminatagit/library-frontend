// app/catalogue/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../../components/BookCard';

export default function Catalogue() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const params = {};
        if (searchQuery) params.q = searchQuery;
        if (genreFilter) params.genre = genreFilter;
        const res = await axios.get('http://localhost:4000/api/books', { params });
        setBooks(res.data);
      } catch (err) {
        console.error('Error fetching books:', err.message);
      }
    };
    fetchBooks();
  }, [searchQuery, genreFilter]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Book Catalogue</h1>
      <div className="form-control mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by title or author..."
          className="input input-bordered w-full mb-4 focus:border-violet-900 focus:ring-violet-900 focus:outline-none"
          style={{ color: '#3b0764' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select select-bordered w-full focus:border-violet-900 focus:ring-violet-900 focus:outline-none"
          style={{ color: '#3b0764' }}
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
        </select>
      </div>
      <div className="flex flex-wrap justify-center">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
