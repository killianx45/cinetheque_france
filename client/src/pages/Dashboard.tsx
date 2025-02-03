import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserFilms } from "../hooks/useUserFilms";

function Dashboard() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const {
    likedFilms,
    watchedFilms,
    watchlistFilms,
    fetchUserFilms,
    handleUnlike,
    handleUnwatch,
    handleUnwatchlist,
  } = useUserFilms();

  useEffect(() => {
    const initDashboard = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        fetchUserFilms();
      }
    };

    initDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 font-['Montserrat']">
      <div className="py-4 mb-8 bg-slate-800">
        <div className="flex items-center justify-center gap-6 mx-auto max-w-7xl">
          <img
            src="src/images/logout.webp"
            alt="logo logout"
            className="w-8 h-8 cursor-pointer md:w-10 md:h-10"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          />
          <img
            src="src/images/home.webp"
            alt="logo home"
            className="w-8 h-8 cursor-pointer md:w-10 md:h-10"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      <div className="px-4 mx-auto max-w-7xl">
        <h1 className="mb-12 text-2xl font-extrabold text-center text-white uppercase md:text-3xl lg:text-4xl font-['Montserrat']">
          Bienvenue sur votre profil, {user?.name}
        </h1>

        {/* Section Films Likés */}
        <FilmSection
          title="Vos films likés"
          films={likedFilms}
          iconSrc="src/images/love.webp"
          onIconClick={(filmId) => handleUnlike(filmId)}
        />

        {/* Section Films Vus */}
        <FilmSection
          title="Vos films déjà vus"
          films={watchedFilms}
          iconSrc="src/images/watch.webp"
          onIconClick={(filmId) => handleUnwatch(filmId)}
        />

        {/* Section Films à Voir */}
        <FilmSection
          title="Vos films à voir"
          films={watchlistFilms}
          iconSrc="src/images/towatch.webp"
          onIconClick={(filmId) => handleUnwatchlist(filmId)}
        />
      </div>
    </div>
  );
}

// Composant réutilisable pour les sections de films
function FilmSection({
  title,
  films,
  iconSrc,
  onIconClick,
}: {
  title: string;
  films: any[];
  iconSrc: string;
  onIconClick: (filmId: string) => void;
}) {
  return (
    <div className="mb-16">
      <h2 className="mb-8 text-xl font-bold text-center text-white uppercase md:text-2xl font-['Montserrat']">
        {title}
      </h2>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
        {films.map((film) => (
          <li key={film._id} className="relative group">
            <div className="aspect-[2/3] rounded-lg overflow-hidden">
              <img
                src={
                  film.posterPath
                    ? `https://image.tmdb.org/t/p/w500${film.posterPath}`
                    : "src/images/affiche.webp"
                }
                alt={film.titre}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute transition-opacity duration-300 transform -translate-x-1/2 opacity-0 bottom-2 left-1/2 group-hover:opacity-100">
              <img
                src={iconSrc}
                alt="icone action"
                onClick={() => onIconClick(film._id)}
                className="w-8 h-8 cursor-pointer bg-white rounded-full p-1.5"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
