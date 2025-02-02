// CvMosaicWrapper.jsx
import React, {useEffect, useState} from "react";
import WatchGrid from '../components/WatchGrid';

export default function WatchLibrary() {
    const [watches, setWatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatches = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/watches/watches`, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                const data = await response.json();
                setWatches(data.watches);
            } catch (error) {
                console.error('Erreur lors de la récupération des montres:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatches();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Chargement...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Bibliothèque de Montres</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <WatchGrid watches={watches} />
            </div>
        </div>
    );
}
