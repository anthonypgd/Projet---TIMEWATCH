import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [watches, setWatches] = useState([]);
    const [brands, setBrands] = useState([]);
    const [newBrand, setNewBrand] = useState({ name: '', country: '' });
    const { getUserInfos } = useContext(UserContext);
    const user = getUserInfos();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Récupérer les utilisateurs
                const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
                    headers: {
                        'Authorization': token
                    }
                });
                const usersData = await usersRes.json();
                if (usersData.users) {
                    setUsers(usersData.users);
                }

                // Récupérer les montres
                const watchesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/watches`, {
                    headers: {
                        'Authorization': token
                    }
                });
                const watchesData = await watchesRes.json();
                if (watchesData.watches) {
                    // Log pour déboguer
                    console.log('Watches data:', watchesData.watches);
                    setWatches(watchesData.watches);
                }

                // Récupérer les marques
                const brandsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/brands`, {
                    headers: {
                        'Authorization': token
                    }
                });
                const brandsData = await brandsRes.json();
                if (brandsData.brands) {
                    setBrands(brandsData.brands);
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

    const handleDeleteBrand = async (brandId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/brands/${brandId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    }
                );

                if (response.ok) {
                    setBrands(brands.filter(brand => brand._id !== brandId));
                }
            } catch (error) {
                console.error('Error deleting brand:', error);
            }
        }
    };

    const handleAddBrand = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/brands`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify(newBrand)
            });

            if (response.ok) {
                const data = await response.json();
                setBrands([...brands, data.brand]);
                setNewBrand({ name: '', country: '' });
            }
        } catch (error) {
            console.error('Error adding brand:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard Administrateur</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Carte pour la gestion des utilisateurs */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Gestion des Utilisateurs</h2>
                    <p className="text-gray-600 mb-4">
                        Gérer les comptes utilisateurs, les rôles et les permissions.
                    </p>
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

                {/* Carte pour la gestion des montres */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Gestion des Montres</h2>
                    <p className="text-gray-600 mb-4">
                        Superviser et gérer toutes les montres publiées.
                    </p>
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
                                        <td className="px-6 py-4">
                                            {watch.marque && watch.marque.name ? watch.marque.name : 'Marque inconnue'}
                                        </td>
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

            {/* Section Marques */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Marques ({brands.length})</h2>
                    <form onSubmit={handleAddBrand} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Nom de la marque"
                            value={newBrand.name}
                            onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                            className="border rounded px-2 py-1"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Pays d'origine"
                            value={newBrand.country}
                            onChange={(e) => setNewBrand({ ...newBrand, country: e.target.value })}
                            className="border rounded px-2 py-1"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                        >
                            Ajouter
                        </button>
                    </form>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left">Nom</th>
                                <th className="px-6 py-3 text-left">Pays</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map(brand => (
                                <tr key={brand._id} className="border-b">
                                    <td className="px-6 py-4">{brand.name}</td>
                                    <td className="px-6 py-4">{brand.country}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteBrand(brand._id)}
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