import {Link} from "react-router-dom";
import {UserContext} from "../context/UserContext.jsx";
import {useContext, useState} from "react";
import imgCompte from '../assets/imgCompte.jpeg'
import imgPostWatch from '../assets/imgPostWatch.webp'
import imgAccueil from '../assets/imgAccueil.jpg'
import {useNavigate} from "react-router-dom";


export default function Header() {
  const { getUserInfos, logout } = useContext(UserContext);
  const user = getUserInfos();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log("User data:", user);

  return (
    <>
      <div className="w-full md:w-[80vw] mx-auto bg-white/40 rounded-xl p-4 backdrop-blur-lg h-auto md:h-20 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <Link to={"/"} className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="bg-black text-white px-2 rounded-l-lg">TIME</span>
            <span className="bg-white text-black px-2 rounded-r-lg">WATCH</span>
          </Link>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto`}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 text-base font-medium flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dashboard Admin
                </Link>
              )}
              
              <Link
                to="/create_watch"
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 text-base font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Publier
              </Link>

              <Link
                to="/profile"
                className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 text-base font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full md:w-auto bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 text-base font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <Link
                to="/login"
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 text-base font-medium text-center"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 text-base font-medium text-center"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>

      {user ? (
          <nav className="w-[80vw] mx-auto mt-4 p-6 backdrop-blur-lg shadow-lg rounded-[2rem] relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40"
                 style={{
                   maskImage: 'radial-gradient(circle at center, black 85%, transparent 100%)',
                   WebkitMaskImage: 'radial-gradient(circle at center, black 85%, transparent 100%)'
                 }}>
            </div>
            <div className="relative z-10">
            <ul className="flex justify-around items-center h-16">
              <li className="relative group p-4 overflow-hidden">
                <Link to="/welcome" className="text-gray-700 hover:text-gray-900 relative z-10 text-lg">
                  <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl font-medium tracking-wide transition-all duration-300 hover:bg-black/70 text-white">
                    Accueil
                  </span>
                </Link>
                <div className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-80 scale-150 group-hover:scale-100 rotate-6 group-hover:rotate-0 transition-all duration-700 ease-out -z-10 rounded-[3rem]"
                     style={{
                       backgroundImage: `url(${imgAccueil})`,
                       width: '140%',
                       height: '180%',
                       top: '-40%',
                       left: '-20%',
                       transformOrigin: 'center',
                       maskImage: 'radial-gradient(circle at center, black 50%, transparent 85%)',
                       WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 85%)'
                     }}>
                </div>
              </li>
              <li className="relative group p-4 overflow-hidden">
                <Link to="/create_watch" className="text-gray-700 hover:text-gray-900 relative z-10 text-lg">
                  <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl font-medium tracking-wide transition-all duration-300 hover:bg-black/70 text-white">
                    Publier une montre
                  </span>
                </Link>
                <div className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-80 scale-150 group-hover:scale-100 rotate-6 group-hover:rotate-0 transition-all duration-700 ease-out -z-10 rounded-[2rem]"
                     style={{
                       backgroundImage: `url(${imgPostWatch})`,
                       width: '140%',
                       height: '180%',
                       top: '-40%',
                       left: '-20%',
                       transformOrigin: 'center',
                       maskImage: 'radial-gradient(circle at center, black 50%, transparent 85%)',
                       WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 85%)'
                     }}>
                </div>
              </li>
              <li className="relative group p-4 overflow-hidden">
                <Link to="/profile" className="text-gray-700 hover:text-gray-900 relative z-10 text-lg">
                  <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl font-medium tracking-wide transition-all duration-300 hover:bg-black/70 text-white">
                    Compte
                  </span>
                </Link>
                <div className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-80 scale-150 group-hover:scale-100 rotate-6 group-hover:rotate-0 transition-all duration-700 ease-out -z-10 rounded-[2rem]"
                     style={{
                       backgroundImage: `url(${imgCompte})`,
                       width: '140%',
                       height: '180%',
                       top: '-40%',
                       left: '-20%',
                       transformOrigin: 'center',
                       maskImage: 'radial-gradient(circle at center, black 50%, transparent 85%)',
                       WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 85%)'
                     }}>
                </div>
              </li>
            </ul>
            </div>
          </nav>
      ) : null
      }

    </>
  );
}