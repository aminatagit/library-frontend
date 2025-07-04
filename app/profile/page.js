// app/profile/page.js
'use client';


import { useEffect, useState } from 'react';
import axios from 'axios';
import BorrowDetails from '../../components/BorrowDetails';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedClient, setCheckedClient] = useState(false);

  useEffect(() => {
    // S'assurer que le code s'exécute côté client
    if (typeof window === 'undefined') return;
    setCheckedClient(true);
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const userRes = await axios.get('http://localhost:4000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        const borrowsRes = await axios.get('http://localhost:4000/api/borrows/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBorrows(borrowsRes.data);
      } catch (err) {
        console.error('Error fetching profile:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (!checkedClient || loading) return <div className="text-center mt-10">Chargement du profil...</div>;
  if (!user) return <div className="text-center mt-10">Vous devez être connecté(e) pour voir votre profil.</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-libraryPrimary">Profil</h2>
          <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Rôle :</strong> {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-libraryPrimary">Mes emprunts</h2>
          {borrows.length === 0 ? (
            <p>Vous n'avez emprunté aucun livre.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full text-base">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Date d'emprunt</th>
                    <th>Date de retour</th>
                    <th>Mon commentaire</th>
                    <th>Ma note</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows.map((borrow) => (
                    <BorrowDetails key={borrow.id} borrow={borrow} user={user} onReturn={(id) => setBorrows(borrows.filter(b => b.id !== id))} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
