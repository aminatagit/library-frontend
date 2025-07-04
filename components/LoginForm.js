// components/LoginForm.js
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/users/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      // Redirection : tout le monde va sur l'accueil, la navbar s'adapte selon le rôle
      router.push('/');
      alert('Connexion réussie !');
    } catch (err) {
      alert('Échec de la connexion : ' + err.message);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl m-4 mx-auto">
      <div className="card-body">
        <h2 className="card-title text-libraryPrimary">Connexion</h2>
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
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary" onClick={handleLogin}>
            Connexion
          </button>
          <button className="btn btn-ghost" onClick={() => router.push('/register')}>
            Inscription
          </button>
          <button className="btn btn-ghost" onClick={() => router.push('/forgot-password')}>
            Mot de passe oublié
          </button>
        </div>
      </div>
    </div>
  );
}