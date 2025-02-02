import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Comments from '../components/Comments';
import LikeButton from '../components/LikeButton';

export default function ViewWatch() {
    const { watch_id } = useParams();
    const navigate = useNavigate();
    const [watch, setWatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatch = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/watches/watch/${watch_id}`, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                const data = await response.json();
                setWatch(data.watch);
            } catch (error) {
                console.error('Erreur lors de la récupération de la montre:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatch();
    }, [watch_id]);

    if (loading) {
        return <div className="text-center py-8">Chargement...</div>;
    }

    if (!watch) {
        return <div className="text-center py-8">Montre non trouvée</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-1/2">
                        {watch.images && watch.images[0] && (
                            <img
                                src={watch.images[0]}
                                alt={`${watch.marque} ${watch.modele}`}
                                className="w-full h-96 object-cover"
                            />
                        )}
                    </div>
                    <div className="p-8 md:w-1/2">
                        <div className="mb-6 flex items-center">
                            <div className="bg-gray-100 rounded-full p-2 mr-3">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-6 w-6 text-gray-600" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Publié par</p>
                                <p className="font-medium text-gray-900">{watch.owner.username}</p>
                            </div>
                        </div>

                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                            {watch.marque}
                        </div>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            {watch.modele}
                        </h1>
                        {watch.prix && (
                            <p className="mt-4 text-2xl text-gray-900">
                                {watch.prix.toLocaleString('fr-FR')} €
                            </p>
                        )}
                        
                        <div className="mt-4 space-y-4">
                            <div>
                                <h2 className="text-gray-500">État</h2>
                                <p className="font-medium">{watch.condition}</p>
                            </div>
                            <div>
                                <h2 className="text-gray-500">Mouvement</h2>
                                <p className="font-medium">{watch.mouvement}</p>
                            </div>
                            <div>
                                <h2 className="text-gray-500">Année</h2>
                                <p className="font-medium">{watch.annee}</p>
                            </div>
                        </div>

                        {watch.description && (
                            <div className="mt-6">
                                <h2 className="text-gray-500">Description</h2>
                                <p className="mt-2 text-gray-600">{watch.description}</p>
                            </div>
                        )}

                        {watch.features && watch.features.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-gray-500">Caractéristiques</h2>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {watch.features.map((feature, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center space-x-2 mt-4">
                            <LikeButton watchId={watch._id} />
                            <span className="text-sm text-gray-500">
                                {watch.likesCount || 0} likes
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <Comments watchId={watch_id} />
        </div>
    );
}