// CvPreview.jsx
import React from 'react';
import {ArrowRight} from "lucide-react";
import {useNavigate, Link} from "react-router-dom";
import LikeButton from './LikeButton';

export default function WatchCard({ watch }) {
    return (
        <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
            <Link 
                to={`/view_watch/${watch._id}`}
                className="block bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
                {watch.images && watch.images[0] && (
                    <img
                        src={watch.images[0]}
                        alt={`${watch.marque} ${watch.modele}`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                )}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-semibold">{watch.marque}</h3>
                        <p className="text-gray-600">{watch.modele}</p>
                        {watch.prix && (
                            <p className="text-gray-800 font-bold mt-2">
                                {watch.prix.toLocaleString('fr-FR')} €
                            </p>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <LikeButton watchId={watch._id} />
                        <span className="text-sm text-gray-500">
                            {watch.likesCount || 0}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}