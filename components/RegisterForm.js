// components/RegisterForm.js
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [receiveLateEmail, setReceiveLateEmail] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:4000/api/users/register', {
        username,
        email,
        password,
        role,
        receive_late_email: receiveLateEmail,
      });
      router.push('/login');
      alert('Inscription réussie !');
    } catch (err) {
      alert("Échec de l'inscription : " + err.message);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl m-4 mx-auto">
      <div className="card-body">
        <h2 className="card-title text-libraryPrimary">Inscription</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nom d'utilisateur</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered focus:border-violet-900 focus:ring-violet-900 focus:outline-none"
            style={{ color: '#3b0764' }}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered focus:border-violet-900 focus:ring-violet-900 focus:outline-none"
            style={{ color: '#3b0764' }}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Mot de passe</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered focus:border-violet-900 focus:ring-violet-900 focus:outline-none"
            style={{ color: '#3b0764' }}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Rôle</span>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select select-bordered w-full focus:border-violet-900 focus:ring-violet-900 focus:outline-none"
            style={{ color: '#3b0764' }}
          >
            <option value="student">Étudiant</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-control mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={receiveLateEmail}
              onChange={e => setReceiveLateEmail(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Recevoir un mail en cas de retard d’emprunt</span>
          </label>
        </div>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary" onClick={handleRegister}>
            Inscription
          </button>
          <button className="btn btn-ghost" onClick={() => router.push('/login')}>
            Connexion
          </button>
        </div>
      </div>
    </div>
  );
}