import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [watches, setWatches] = useState([]);
    const { getUserInfos } = useContext(UserContext);
    const user = getUserInfos();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Using token:', token);

                // URLs correctes
                const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Users response:', usersRes);
                
                const usersData = await usersRes.json();
                console.log('Users data:', usersData);
                
                if (usersData.users) {
                    setUsers(usersData.users);
                }

                // Récupérer les montres
                const watchesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/watches`, {
                    headers: {
                        'Authorization': token
                    }
                });
                console.log('Watches response status:', watchesRes.status);
                
                const watchesData = await watchesRes.json();
                console.log('Watches data:', watchesData);
                
                if (watchesData.watches) {
                    setWatches(watchesData.watches);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                setUsers(users.filter(user => user._id !== userId));
                setWatches(watches.filter(watch => watch.owner._id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleDeleteWatch = async (watchId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette montre ?')) {
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/api/admin/watches/${watchId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                setWatches(watches.filter(watch => watch._id !== watchId));
            } catch (error) {
                console.error('Error deleting watch:', error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard Administrateur</h1>
            
            {/* Section Utilisateurs */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Utilisateurs ({users.length})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left">Username</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Rôle</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b">
                                    <td className="px-6 py-4">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Section Montres */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Montres ({watches.length})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left">Marque</th>
                                <th className="px-6 py-3 text-left">Modèle</th>
                                <th className="px-6 py-3 text-left">Propriétaire</th>
                                <th className="px-6 py-3 text-left">Prix</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {watches.map(watch => (
                                <tr key={watch._id} className="border-b">
                                    <td className="px-6 py-4">{watch.marque}</td>
                                    <td className="px-6 py-4">{watch.modele}</td>
                                    <td className="px-6 py-4">{watch.owner.username}</td>
                                    <td className="px-6 py-4">{watch.prix}€</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteWatch(watch._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 