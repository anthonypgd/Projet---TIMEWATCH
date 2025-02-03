import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function Comments({ watchId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { getUserInfos } = useContext(UserContext);
    const user = getUserInfos();

    // Log de debug pour voir les données utilisateur
    console.log('User data in Comments:', {
        user,
        userId: user?._id,
        userRole: user?.role
    });

    // Log pour voir les infos utilisateur
    console.log('User infos détaillées:', {
        user: JSON.stringify(user, null, 2),
        userData: localStorage.getItem('userData'),
        token: localStorage.getItem('token')?.substring(0, 20) + '...' // On ne montre qu'une partie du token
    });

    const fetchComments = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/comments/watch/${watchId}`,
                {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );
            const data = await response.json();
            setComments(data.comments);
        } catch (error) {
            console.error('Erreur chargement commentaires:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Pas de token trouvé');
            return;
        }

        fetchComments();
    }, [watchId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vous devez être connecté pour commenter');
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/comments/watch/${watchId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ content: newComment })
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Erreur lors de l\'ajout du commentaire');
            }

            const data = await response.json();
            setComments([data.comment, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Erreur:', error);
            alert(`Erreur: ${error.message}`);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/comments/${commentId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token
                    }
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            // Mise à jour de l'état local
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('Erreur lors de la suppression du commentaire');
        }
    };

    const canDeleteComment = (comment) => {
        if (!user) return false;
        return user.role === 'admin' || user.id === comment.author._id;
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Commentaires</h3>
            
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                />
                <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Publier
                </button>
            </form>

            <div className="space-y-4">
                {comments.map(comment => {
                    // Log de debug modifié pour utiliser user.id
                    console.log('Comment check:', {
                        commentAuthorId: comment.author._id,
                        userId: user?.id,
                        isAdmin: user?.role === 'admin',
                        shouldShowDelete: user?.role === 'admin' || user?.id === comment.author._id
                    });

                    return (
                        <div key={comment._id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{comment.author.username}</p>
                                    <p className="mt-1">{comment.content}</p>
                                </div>
                                {(user?.role === 'admin' || user?.id === comment.author._id) && (
                                    <button
                                        onClick={() => handleDelete(comment._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Supprimer
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm mt-2">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 