import { Link } from 'react-router-dom';

export default function WatchGrid({ watches }) {
  return (
    <>
      {watches.map((watch) => (
        <Link 
          to={`/view_watch/${watch._id}`} 
          key={watch._id}
          className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            {watch.images && watch.images[0] && (
              <img
                src={watch.images[0]}
                alt={`${watch.marque} ${watch.modele}`}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="absolute top-0 right-0 bg-black/70 text-white px-3 py-1 m-2 rounded-full">
              {watch.prix.toLocaleString('fr-FR')} €
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">{watch.marque}</h2>
            <h3 className="text-lg text-gray-600">{watch.modele}</h3>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                {watch.condition}
              </span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                {watch.mouvement}
              </span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                {watch.annee}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}