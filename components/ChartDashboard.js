// components/ChartDashboard.js
'use client';

import { useState, useEffect } from 'react';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';

import AdminBooksWithComments from './AdminBooksWithComments';


ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale);

export default function ChartDashboard() {

  // Pie chart: répartition des rôles utilisateurs
  const [rolePieData, setRolePieData] = useState({
    labels: ['Étudiants', 'Admins'],
    datasets: [
      {
        label: 'Répartition des rôles',
        data: [0, 0],
        backgroundColor: ['#36D399', '#F87272'],
      },
    ],
  });


  // Radar chart: nombre de commentaires par livre (top 5)
  const [commentsRadarData, setCommentsRadarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Commentaires par livre',
        data: [],
        backgroundColor: 'rgba(59, 7, 100, 0.2)',
        borderColor: '#3b0764',
        pointBackgroundColor: '#3b0764',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3b0764',
      },
    ],
  });

  const [ratingData, setRatingData] = useState({
    labels: ['1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'],
    datasets: [
      {
        label: 'Répartition des notes',
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#4A90E2', '#F4A261', '#2A9D8F', '#3ABFF8', '#36D399'],
      },
    ],
  });
  const [borrowData, setBorrowData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Livres empruntés',
        data: [],
        borderColor: '#4A90E2',
        fill: false,
      },
    ],
  });

  useEffect(() => {
        // Debug pour le pie chart "Répartition des notes"
        if (typeof ratingsRes !== 'undefined') {
          console.log('Réponse API /api/admin/stats/ratings:', ratingsRes.data);
          if (!Array.isArray(ratingsRes.data)) {
            alert('Réponse inattendue de l’API /api/admin/stats/ratings. Voir la console pour le détail.');
            console.log('Type de réponse:', typeof ratingsRes.data, ratingsRes.data);
          } else if (ratingsRes.data.length === 0) {
            alert('Aucune note trouvée dans la base.');
          }
        }
    const fetchChartData = async () => {
      try {
        const [ratingsRes, borrowsRes, usersRes, commentsRes] = await Promise.all([
          axios.get('http://localhost:4000/api/admin/stats/ratings', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:4000/api/admin/stats/borrows', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:4000/api/admin/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:4000/api/admin/stats/comments', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        // Affichage de la réponse brute pour debug
        console.log('Réponse API /api/admin/stats/comments:', commentsRes.data);
        if (!Array.isArray(commentsRes.data)) {
          alert('Réponse inattendue de l’API /api/admin/stats/comments. Voir la console pour le détail.');
          console.log('Type de réponse:', typeof commentsRes.data, commentsRes.data);
        } else if (commentsRes.data.length === 0) {
          alert('Aucun livre avec commentaire trouvé dans la base.');
        }

        // Correction : forcer un tableau de 5 valeurs numériques pour le graphe
        let ratings = Array.isArray(ratingsRes.data) ? ratingsRes.data : [0, 0, 0, 0, 0];
        if (ratings.length < 5) {
          ratings = [...ratings, ...Array(5 - ratings.length).fill(0)];
        } else if (ratings.length > 5) {
          ratings = ratings.slice(0, 5);
        }
        setRatingData({
          labels: ['1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'],
          datasets: [
            {
              label: 'Répartition des notes',
              data: ratings,
              backgroundColor: ['#4A90E2', '#F4A261', '#2A9D8F', '#3ABFF8', '#36D399'],
            },
          ],
        });

        setBorrowData({
          labels: borrowsRes.data.labels,
          datasets: [
            {
              label: 'Livres empruntés',
              data: borrowsRes.data.data,
              borderColor: '#4A90E2',
              fill: false,
            },
          ],
        });

        // Pie chart: répartition des rôles
        // Correction : robustesse pour le pie chart rôles
        let nbAdmins = 0;
        let nbStudents = 0;
        if (Array.isArray(usersRes.data)) {
          nbAdmins = usersRes.data.filter((u) => u.isAdmin).length;
          nbStudents = usersRes.data.length - nbAdmins;
        }
        setRolePieData({
          labels: ['Étudiants', 'Admins'],
          datasets: [
            {
              label: 'Répartition des rôles',
              data: [nbStudents, nbAdmins],
              backgroundColor: ['#36D399', '#F87272'],
            },
          ],
        });
        // Debug Pie chart
        console.log('Réponse API /api/admin/users:', usersRes.data);
        if (!Array.isArray(usersRes.data)) {
          alert('Réponse inattendue de l’API /api/admin/users. Voir la console pour le détail.');
          console.log('Type de réponse:', typeof usersRes.data, usersRes.data);
        } else if (usersRes.data.length === 0) {
          alert('Aucun utilisateur trouvé dans la base.');
        }

        // Radar chart: top 5 livres avec le plus de commentaires
        // commentsRes.data doit être un tableau d'objets { title, count }
        let top5 = [];
        if (Array.isArray(commentsRes.data)) {
          // Tri décroissant par nombre de commentaires
          top5 = [...commentsRes.data]
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        }
        // Limiter la longueur des titres pour la lisibilité
        const shortLabels = top5.map((b) => b.title.length > 18 ? b.title.slice(0, 15) + '…' : b.title);
        setCommentsRadarData({
          labels: shortLabels,
          datasets: [
            {
              label: 'Commentaires par livre',
              data: top5.map((b) => b.count),
              backgroundColor: 'rgba(59, 7, 100, 0.2)',
              borderColor: '#3b0764',
              pointBackgroundColor: '#3b0764',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#3b0764',
            },
          ],
        });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          alert('Accès refusé : vous devez être connecté en tant qu\'administrateur pour voir les statistiques.');
        }
        console.error('Error fetching chart data:', err.message);
      }
    };
    fetchChartData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-libraryPrimary">Statistiques de la bibliothèque</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Répartition des notes</h3>
            <div className="flex justify-center">
              <Bar
                data={ratingData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: '#3b0764', font: { size: 13 } },
                    },
                    y: {
                      beginAtZero: true,
                      grid: { color: '#e5e7eb' },
                      ticks: { color: '#3b0764', font: { size: 13 }, stepSize: 1 },
                    },
                  },
                  maintainAspectRatio: false,
                  aspectRatio: 2.2,
                }}
                height={220}
              />
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Tendances des emprunts</h3>
            <div className="flex justify-center">
              <Line
                data={borrowData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: '#3b0764', font: { size: 13 } },
                    },
                    y: {
                      beginAtZero: true,
                      grid: { color: '#e5e7eb' },
                      ticks: { color: '#3b0764', font: { size: 13 }, stepSize: 1 },
                    },
                  },
                  maintainAspectRatio: false,
                  aspectRatio: 2.2,
                }}
                height={220}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Top 5 livres par commentaires</h3>
            <div className="flex justify-center">
              {commentsRadarData.labels.length === 0 ? (
                <div className="text-gray-500">Pas de données à afficher.</div>
              ) : (
                <Radar
                  data={commentsRadarData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: Math.max(...commentsRadarData.datasets[0].data, 5),
                        pointLabels: {
                          font: { size: 12 },
                          color: '#3b0764',
                        },
                        ticks: {
                          stepSize: 1,
                          color: '#3b0764',
                          backdropColor: 'transparent',
                          font: { size: 11 },
                          callback: function(value) { return Number(value) % 1 === 0 ? value : null; }
                        },
                        grid: { color: '#e5e7eb' },
                      },
                    },
                    maintainAspectRatio: false,
                    aspectRatio: 1.2,
                  }}
                  height={220}
                />
              )}
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Répartition des rôles utilisateurs</h3>
            <div className="flex justify-center">
              <Pie
                data={rolePieData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: { color: '#3b0764', font: { size: 13 } },
                    },
                    title: { display: false },
                  },
                  maintainAspectRatio: false,
                  aspectRatio: 1.2,
                }}
                height={220}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <AdminBooksWithComments />
      </div>
    </div>
  );
}