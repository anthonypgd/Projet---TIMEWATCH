import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WatchCard from '../components/WatchCard';

export default function UserCollection() {
    const { userId } = useParams();
    const [watches, setWatches] = useState([]);
    const [ownerName, setOwnerName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/watches/user/${userId}`,
                    {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    }
                );
                const data = await response.json();
                console.log('Données reçues:', JSON.stringify(data, null, 2));
                if (response.ok) {
                    setWatches(data.watches);
                    if (data.watches && data.watches.length > 0 && data.watches[0].owner) {
                        console.log('Owner complet:', data.watches[0].owner);
                        setOwnerName(data.watches[0].owner.username);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    console.log('État actuel:', { watches, ownerName, loading });

    if (loading) return <div className="text-center py-8">Chargement...</div>;
    if (!ownerName) return <div className="text-center py-8">Collection non trouvée</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-4">
                    Collection de {ownerName}
                </h1>
                <p className="text-gray-600">
                    {watches.length} {watches.length <= 1 ? 'montre' : 'montres'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {watches.map(watch => (
                    <WatchCard 
                        key={watch._id} 
                        watch={{
                            ...watch,
                            marque: watch.marque
                        }} 
                    />
                ))}
            </div>
        </div>
    );
} 