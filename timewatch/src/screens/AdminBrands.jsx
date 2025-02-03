import React, { useState, useEffect } from 'react';

export default function AdminBrands() {
    const [brands, setBrands] = useState([]);
    const [newBrand, setNewBrand] = useState({ name: '', description: '', country: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/brands`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setBrands(data.brands);
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur lors du chargement des marques');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/brands`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newBrand)
            });

            if (response.ok) {
                setNewBrand({ name: '', description: '', country: '' });
                loadBrands();
            }
        } catch (error) {
            setError('Erreur lors de l\'ajout de la marque');
        }
    };

    const handleDelete = async (brandId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/brands/${brandId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                if (response.ok) {
                    loadBrands();
                }
            } catch (error) {
                setError('Erreur lors de la suppression de la marque');
            }
        }
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;
    if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Gestion des Marques</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Nom de la marque"
                        value={newBrand.name}
                        onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Pays d'origine"
                        value={newBrand.country}
                        onChange={(e) => setNewBrand({ ...newBrand, country: e.target.value })}
                        className="border p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Ajouter
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map(brand => (
                    <div key={brand._id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold">{brand.name}</h3>
                                <p className="text-gray-600">{brand.country}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(brand._id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 