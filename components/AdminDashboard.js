// components/AdminDashboard.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', genre: '' });
  const [editBookId, setEditBookId] = useState(null);
  const [editBook, setEditBook] = useState({ title: '', author: '', genre: '' });
  const router = useRouter();
  const handleEditClick = (book) => {
    setEditBookId(book.id);
    setEditBook({ title: book.title, author: book.author, genre: book.genre });
  };

  const handleEditChange = (e) => {
    setEditBook({ ...editBook, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/admin/books/${id}`, editBook, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Livre modifié !');
      setEditBookId(null);
      setEditBook({ title: '', author: '', genre: '' });
      const res = await axios.get('http://localhost:4000/api/books', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBooks(res.data);
    } catch (err) {
      alert("Erreur lors de la modification : " + err.message);
    }
  };

  const handleEditCancel = () => {
    setEditBookId(null);
    setEditBook({ title: '', author: '', genre: '' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, userRes] = await Promise.all([
          axios.get('http://localhost:4000/api/books', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:4000/api/admin/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setBooks(bookRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error('Error fetching admin data:', err.message);
      }
    };
    fetchData();
  }, []);

  const handleAddBook = async () => {
    try {
      await axios.post('http://localhost:4000/api/admin/books', newBook, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Livre ajouté !');
      setNewBook({ title: '', author: '', genre: '' });
      const res = await axios.get('http://localhost:4000/api/books', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBooks(res.data);
    } catch (err) {
      alert("Erreur lors de l'ajout : " + err.message);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/books/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Livre supprimé !');
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-libraryPrimary">Gestion des livres</h2>
      <div className="card bg-base-100 shadow-xl mb-4">
        <div className="card-body">
          <h3 className="card-title">Ajouter un livre</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Titre</span>
            </label>
            <input
              type="text"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="input input-bordered"
            />
            <label className="label">
              <span className="label-text">Auteur</span>
            </label>
            <input
              type="text"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="input input-bordered"
            />
            <label className="label">
              <span className="label-text">Genre</span>
            </label>
            <input
              type="text"
              value={newBook.genre}
              onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              className="input input-bordered"
            />
            <button className="btn btn-primary mt-4" onClick={handleAddBook}>
              Ajouter
            </button>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Gérer les livres</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Auteur</th>
                  <th>Genre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    {editBookId === book.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            name="title"
                            value={editBook.title}
                            onChange={handleEditChange}
                            className="input input-bordered input-sm"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="author"
                            value={editBook.author}
                            onChange={handleEditChange}
                            className="input input-bordered input-sm"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="genre"
                            value={editBook.genre}
                            onChange={handleEditChange}
                            className="input input-bordered input-sm"
                          />
                        </td>
                        <td>
                          <button className="btn btn-sm btn-success mr-2" onClick={() => handleEditSave(book.id)}>
                          Enregistrer
                          </button>
                          <button className="btn btn-sm btn-ghost" onClick={handleEditCancel}>
                          Annuler
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>
                          <button className="btn btn-sm btn-warning mr-2" onClick={() => handleEditClick(book)}>
                            Modifier
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button className="btn btn-ghost mt-4" onClick={() => router.push('/')}> 
        Retour &agrave; l&apos;accueil
      </button>
    </div>
  );
}