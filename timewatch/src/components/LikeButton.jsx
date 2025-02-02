import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function LikeButton({ watchId }) {
    const [isLiked, setIsLiked] = useState(false);
    const { getUserInfos } = useContext(UserContext);
    const user = getUserInfos();

    // Vérifier si la montre est déjà likée au chargement
    useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/likes/check/${watchId}`,
                    {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    }
                );
                const data = await response.json();
                setIsLiked(data.liked);
            } catch (error) {
                console.error('Erreur vérification like:', error);
            }
        };

        if (user) {
            checkLikeStatus();
        }
    }, [watchId, user]);

    const toggleLike = async () => {
        if (!user) {
            alert('Vous devez être connecté pour liker une montre');
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/likes/toggle/${watchId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );
            const data = await response.json();
            setIsLiked(data.liked);
        } catch (error) {
            console.error('Erreur toggle like:', error);
        }
    };

    return (
        <button
            onClick={toggleLike}
            className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
            } hover:text-red-600 transition-colors`}
        >
            <svg
                className="w-6 h-6"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    );
} 