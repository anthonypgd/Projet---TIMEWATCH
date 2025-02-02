import {useEffect, useState} from "react";
import WatchGrid from "../components/WatchGrid.jsx";

const VITE_API_URL = `${import.meta.env.VITE_API_URL}/api/watches/watches`;

export default function WelcomeScreen() {
    const [watches, setWatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Fonction pour filtrer les montres dans la variable filteredWatches
    const filteredWatches = watches.filter(watch =>
        watch.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        watch.modele.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function fetchWatches() {
        const token = localStorage.getItem("token");
        
        if (!token) {
            console.error('Token manquant');
            return;
        }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        };

        fetch(`${import.meta.env.VITE_API_URL}/api/watches/watches`, {
            method: "GET",
            headers
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (!data || !data.watches) {
                console.error('Données invalides:', data);
                return;
            }
            // Trier les montres par date de création
            const sortedWatches = data.watches.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setWatches(sortedWatches);
        })
        .catch(error => {
            console.error('Error fetching watches:', error);
            setWatches([]); // Initialiser avec un tableau vide en cas d'erreur
        });
    }

    useEffect(() => {
        fetchWatches();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-transparent bg-clip-text p-4 drop-shadow-lg tracking-wide">
                Bienvenue dans votre Collection Horlogère
            </h1>

            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Rechercher par marque ou modèle" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}  // Mise à jour de l'état à chaque frappe
                    className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-4 text-center">
                    <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-md">
                        <div className="flex items-center gap-3">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 text-blue-600" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                                />
                            </svg>
                            <p className="text-gray-700">
                                Découvrez les dernières montres publiées par vous et la communauté
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {watches.length} {watches.length <= 1 ? 'montre disponible' : 'montres disponibles'}
                        </p>
                    </div>
                </div>
            </div>
  
            {/*  */} 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
                <WatchGrid watches={filteredWatches} // On affiche la liste des montres correspondant à la variable filteredWatches
                 /> 
            </div>
        </div>
    );
}