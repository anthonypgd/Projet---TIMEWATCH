import WatchCard from '../components/WatchCard';

// Dans votre composant
return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watches.map(watch => (
            <WatchCard key={watch._id} watch={watch} />
        ))}
    </div>
); 