// components/ForgotPasswordForm.js
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:4000/api/users/forgot-password', { email });
      alert('Email de réinitialisation envoyé !');
      router.push('/login');
    } catch (err) {
      alert("Erreur lors de l'envoi de l'email : " + err.message);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl m-4 mx-auto">
      <div className="card-body">
        <h2 className="card-title text-libraryPrimary">Mot de passe oublié</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered"
          />
        </div>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary" onClick={handleForgotPassword}>
            Envoyer l'email de réinitialisation
          </button>
          <button className="btn btn-ghost" onClick={() => router.push('/login')}>
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}