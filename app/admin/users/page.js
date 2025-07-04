// app/admin/users/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'student', receive_late_email: false });
  const [editUser, setEditUser] = useState(null);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password || !newUser.role) {
      setMessage("Veuillez remplir tous les champs (nom d'utilisateur, email, mot de passe, rôle).");
      return;
    }
    try {
      await axios.post('http://localhost:4000/api/admin/users', {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        receive_late_email: newUser.receive_late_email,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNewUser({ username: '', email: '', password: '', role: 'student', receive_late_email: false });
      setMessage("L'utilisateur a bien été ajouté.");
      fetchUsers();
    } catch (err) {
      setMessage("Erreur lors de l'ajout de l'utilisateur. Vérifiez que l'email n'existe pas déjà et que tous les champs sont valides.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!id) {
      setMessage("Impossible de supprimer cet utilisateur : identifiant manquant.");
      return;
    }
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await axios.delete(`http://localhost:4000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage("L'utilisateur a bien été supprimé.");
      fetchUsers();
    } catch (err) {
      setMessage("Erreur lors de la suppression.");
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
  };

  const handleUpdateUser = async () => {
    if (!editUser || !editUser.id) {
      setMessage("Impossible de modifier cet utilisateur : identifiant manquant.");
      return;
    }
    try {
      await axios.put(`http://localhost:4000/api/admin/users/${editUser.id}`, {
        username: editUser.username,
        email: editUser.email,
        role: editUser.isAdmin ? 'admin' : 'student',
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditUser(null);
      setMessage("L'utilisateur a bien été modifié.");
      fetchUsers();
    } catch (err) {
      setMessage("Erreur lors de la modification. Vérifiez que l'email est valide et unique.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-libraryPrimary">Gestion des utilisateurs</h2>

      {message && (
        <div className="alert alert-info mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span>{message}</span>
        </div>
      )}
      {/* Ajout utilisateur en haut, esthétique et responsive */}
      <div className="mb-8 bg-base-200 rounded-lg p-4 shadow flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className="input input-bordered w-full md:w-auto"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full md:w-auto"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="input input-bordered w-full md:w-auto"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            className="select select-bordered w-full md:w-auto"
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="student">Étudiant</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex flex-col justify-center md:ml-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={newUser.receive_late_email}
              onChange={e => setNewUser({ ...newUser, receive_late_email: e.target.checked })}
            />
            Recevoir un mail en cas de retard
          </label>
        </div>
        <button className="btn btn-success w-full md:w-auto" onClick={handleAddUser}>
          Ajouter un utilisateur
        </button>
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="text-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Mail de retard</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id || user.email || idx}>
                  <td>{user.username || '-'}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? 'Admin' : 'Étudiant'}</td>
                  <td>
                    <span className={`badge ${user.receive_late_email ? 'badge-success' : 'badge-ghost'} px-3 py-1`}>{user.receive_late_email ? 'Oui' : 'Non'}</span>
                  </td>
                  <td>
                    {user.id && (
                      <button className="btn btn-xs btn-info mr-2" onClick={() => handleEditUser(user)}>
                        Modifier
                      </button>
                    )}
                    {user.id && (
                      <button className="btn btn-xs btn-error" onClick={() => handleDeleteUser(user.id)}>
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="font-bold mb-2">Modifier l'utilisateur</h3>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              value={editUser.username}
              onChange={e => setEditUser({ ...editUser, username: e.target.value })}
              placeholder="Nom d'utilisateur"
            />
            <input
              type="email"
              className="input input-bordered w-full mb-2"
              value={editUser.email}
              onChange={e => setEditUser({ ...editUser, email: e.target.value })}
              placeholder="Email"
            />
            <select
              className="select select-bordered w-full mb-2"
              value={editUser.isAdmin ? 'admin' : 'student'}
              onChange={e => setEditUser({ ...editUser, isAdmin: e.target.value === 'admin' })}
            >
              <option value="student">Étudiant</option>
              <option value="admin">Admin</option>
            </select>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={!!editUser.receive_late_email}
                onChange={e => setEditUser({ ...editUser, receive_late_email: e.target.checked })}
              />
              <span>Recevoir un mail en cas de retard</span>
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-secondary" onClick={() => setEditUser(null)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleUpdateUser}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
