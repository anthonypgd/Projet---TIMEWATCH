import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import LikeButton from '../components/LikeButton';

export default function UserProfile() {
    const { getUserInfos } = useContext(UserContext);
    const [userWatches, setUserWatches] = useState([]);
    const [likedWatches, setLikedWatches] = useState([]);
    const { user } = useContext(UserContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const fetchUserWatches = async () => {
        try {
            console.log('Fetching watches for user ID:', user.id);
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/watches/user/${user.id}`,
                {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );
            
            const data = await response.json();
            if (response.ok) {
                setUserWatches(data.watches);
            }
        } catch (error) {
            console.error('Error fetching user watches:', error);
        }
    };

    const fetchLikedWatches = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/likes/user/likes`,
                {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );
            const data = await response.json();
            if (response.ok) {
                setLikedWatches(data.watches);
            }
        } catch (error) {
            console.error('Erreur chargement likes:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserWatches();
            fetchLikedWatches();
        }
    }, [user]);

    const handleDeleteWatch = async (watchId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette montre ?')) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/watches/watch/${watchId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    }
                );

                if (response.ok) {
                    // Mettre à jour la liste des montres après la suppression
                    setUserWatches(watches => watches.filter(watch => watch._id !== watchId));
                }
            } catch (error) {
                console.error('Error deleting watch:', error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">Profil de {user?.username}</h1>
                        <p className="text-gray-600">Email: {user?.email}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Modifier mon profil
                        </button>
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Changer le mot de passe
                        </button>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600">
                                {userWatches.length}
                            </div>
                            <div className="text-gray-600">
                                {userWatches.length <= 1 ? 'Publication' : 'Publications'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Mes Montres</h2>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                        {userWatches.length} {userWatches.length <= 1 ? 'montre' : 'montres'}
                    </span>
                </div>
                {userWatches.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Vous n'avez pas encore publié de montres.</p>
                        <Link 
                            to="/create_watch" 
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Publier ma première montre
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userWatches.map(watch => (
                            <div key={watch._id} className="relative">
                                <Link 
                                    to={`/view_watch/${watch._id}`}
                                    className="block bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    {watch.images && watch.images[0] && (
                                        <img
                                            src={watch.images[0]}
                                            alt={`${watch.marque.name} ${watch.modele}`}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <h3 className="text-xl font-semibold">{watch.marque.name}</h3>
                                    <p className="text-gray-600">{watch.modele}</p>
                                    {watch.prix && (
                                        <p className="text-gray-800 font-bold mt-2">
                                            {watch.prix.toLocaleString('fr-FR')} €
                                        </p>
                                    )}
                                </Link>
                                <button
                                    onClick={() => handleDeleteWatch(watch._id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    title="Supprimer cette montre"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Montres Likées</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedWatches.map(watch => (
                        <div key={watch._id} className="relative bg-white rounded-lg shadow-md overflow-hidden">
                            <Link 
                                to={`/view_watch/${watch._id}`}
                                className="block bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                {watch.images && watch.images[0] && (
                                    <img
                                        src={watch.images[0]}
                                        alt={`${watch.marque.name} ${watch.modele}`}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h3 className="text-xl font-semibold">{watch.marque.name}</h3>
                                <p className="text-gray-600">{watch.modele}</p>
                                {watch.prix && (
                                    <p className="text-gray-800 font-bold mt-2">
                                        {watch.prix.toLocaleString('fr-FR')} €
                                    </p>
                                )}
                            </Link>
                            <LikeButton watchId={watch._id} />
                        </div>
                    ))}
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentUser={user}
            />
            
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
}
