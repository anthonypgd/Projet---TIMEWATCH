import {Link} from "react-router-dom";
import {UserContext} from "../context/UserContext.jsx";
import {useContext} from "react";
import imgCompte from '../assets/imgCompte.jpeg'
import imgPostWatch from '../assets/imgPostWatch.webp'
import imgAccueil from '../assets/imgAccueil.jpg'


export default function Header() {
  const { getUserInfos, logout } = useContext(UserContext);
  const user = getUserInfos();

  console.log("User data:", user);

  return (
      <>
        <div className="w-[80vw] mx-auto bg-white/40 rounded-xl p-4 backdrop-blur-lg cursor-pointer h-20 flex justify-between items-center gap-x-10 shadow-lg">
          <div className="flex items-center space-x-4">
            <Link to={"/"} className="text-3xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="bg-black text-white px-2 rounded-l-lg">TIME</span>
              <span className="bg-white text-black px-2 rounded-r-lg">WATCH</span>
            </Link>
          </div>

          {user ? (
              <div className="flex items-center space-x-6">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 text-base font-medium flex items-center gap-2"
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
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    Dashboard Admin
                  </Link>
                )}
                <button
                    onClick={logout}
                    className="bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 py-2 px-6 rounded-lg shadow-md transition-all duration-300 text-base font-medium"
                >
                  Déconnexion
                </button>
                <Link
                    to="/profile"
                    className="bg-green-400 hover:bg-green-500 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 text-lg font-semibold min-w-[120px] text-center"
                >
                  {user?.username}
                </Link>
              </div>
          ) : (
              <Link
                  to="/login"
                  className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] hover:bg-[#2ECC71] hover:bg-none text-white py-3 px-6 rounded-lg shadow-lg font-semibold tracking-wide border border-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </Link>
          )}
        </div>

        {/* Ajout de la navbar */}

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