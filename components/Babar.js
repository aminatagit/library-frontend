// components/Babar.js
'use client'; // Assure que tout le composant est rendu côté client

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function Navbar({ onSearch, pathname }) {
  // Initialisation temporaire côté serveur, mise à jour côté client
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Mise à jour de l'état uniquement côté client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        try {
          const decoded = jwtDecode(token);
          setIsAdmin(decoded.role === 'admin');
        } catch (err) {
          console.error('Error decoding token:', err.message);
        }
      }
    }
  }, []); // Vide pour exécuter une seule fois après montage

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push('/');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  // Si on est sur /admin, /admin/users ou /books, afficher une navbar admin avec Dashboard
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/admin/users') || pathname.startsWith('/books'))) {
    // Ne jamais afficher le bouton Dashboard pour les étudiants
    if (!isAdmin) {
      return (
        <div className="navbar bg-primary text-primary-content shadow-lg">
          <div className="flex-1">
            <button className="btn btn-ghost text-xl" onClick={() => router.push('/')}>Accueil</button>
          </div>
          <div className="flex-none gap-2">
            {pathname.startsWith('/admin/users') && (
              <button className="btn btn-warning" onClick={() => router.push('/admin')}>
                <span className="inline-flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Gérer les livres
                </span>
              </button>
            )}
            {/* Cacher le bouton Gérer les utilisateurs pour les étudiants sur toutes les pages, y compris /books */}
            {isAdmin && !(pathname.startsWith('/admin/users')) && (
              <button className="btn btn-info" onClick={() => router.push('/admin/users')}>Gérer les utilisateurs</button>
            )}
            <button className="btn btn-info" onClick={() => router.push('/profile')}>Profil</button>
            <button className="btn btn-error" onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>
      );
    }
    // Pour les admins, afficher le bouton Dashboard
    return (
      <div className="navbar bg-primary text-primary-content shadow-lg">
        <div className="flex-1">
          <button className="btn btn-ghost text-xl" onClick={() => router.push('/')}>Accueil</button>
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-accent" onClick={() => router.push('/dashboard')}>
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" /></svg>
              Dashboard
            </span>
          </button>
          {pathname.startsWith('/admin/users') && (
            <button className="btn btn-warning" onClick={() => router.push('/admin')}>
              <span className="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Gérer les livres
              </span>
            </button>
          )}
          {/* Cacher le bouton Gérer les utilisateurs sur la page de gestion des utilisateurs */}
          {!(pathname.startsWith('/admin/users')) && (
            <button className="btn btn-info" onClick={() => router.push('/admin/users')}>Gérer les utilisateurs</button>
          )}
          <button className="btn btn-info" onClick={() => router.push('/profile')}>Profil</button>
          <button className="btn btn-error" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>
    );
  }
  // Sinon, navbar complète
  return (
    <div className="navbar bg-primary text-primary-content shadow-lg">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={() => router.push('/')}> 
          Accueil
        </a>
      </div>
      <div className="flex-none gap-2">
        {/* Champ de recherche supprimé */}
        {isLoggedIn ? (
          <>
            {isAdmin && (
              <button className="btn btn-accent" onClick={() => router.push('/dashboard')}>
                Dashboard
              </button>
            )}
            <button className="btn btn-success" onClick={() => router.push('/catalogue')}>
              Catalogue
            </button>
            <button className="btn btn-info" onClick={() => router.push('/profile')}>
              Profile
            </button>
            {/* Boutons admin uniquement visibles pour les admins */}
            {isAdmin && (
              <>
                <button className="btn btn-warning" onClick={() => router.push('/admin')}>
                  <span className="inline-flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Gérer les livres
                  </span>
                </button>
                <button className="btn btn-info" onClick={() => router.push('/admin/users')}>
                  <span className="inline-flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" /></svg>
                    Gérer les utilisateurs
                  </span>
                </button>
              </>
            )}
            <button className="btn btn-error" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => router.push('/login')}>
              Login
            </button>
            <button className="btn btn-accent" onClick={() => router.push('/register')}>
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}