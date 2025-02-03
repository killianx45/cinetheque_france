import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFilms } from "../hooks/useFilms";
import { useUserFilms } from "../hooks/useUserFilms";

function Home() {
  const navigate = useNavigate();
  const { films, genres, loading, fetchFilms, fetchGenres, searchFilms } =
    useFilms();
  const { likeFilm, watchFilm, watchlistFilm } = useUserFilms();
  const [selectedFilmId, setSelectedFilmId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [movieSessions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [showInput, setShowInput] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [filteredFilms, setFilteredFilms] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const filmsPerPage = 50;
  const indexOfLastFilm = currentPage * filmsPerPage;

  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;

  const currentFilms =
    searchTerm.length >= 3
      ? searchResults.slice(indexOfFirstFilm, indexOfLastFilm)
      : filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);

  const totalFilms =
    searchTerm.length >= 3 ? searchResults.length : filteredFilms.length;

  const pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(totalFilms / filmsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPaginationButton = (number: number) => (
    <li key={number}>
      <button onClick={() => setCurrentPage(number)} className="text-white">
        {number}
      </button>
    </li>
  );

  const renderEllipsis = (key: string) => (
    <span key={key} className="px-3 text-white">
      ...
    </span>
  );

  const renderPagination = () => {
    if (pageNumbers.length <= 5) {
      return pageNumbers.map((number) => renderPaginationButton(number));
    } else {
      let pagesToDisplay = [];

      pagesToDisplay.push(renderPaginationButton(1));

      if (currentPage > 3) {
        pagesToDisplay.push(renderEllipsis("ellipsis1"));
      }

      for (
        let i = Math.max(2, currentPage - 2);
        i <= Math.min(currentPage + 2, pageNumbers.length - 1);
        i++
      ) {
        pagesToDisplay.push(renderPaginationButton(i));
      }

      if (currentPage < pageNumbers.length - 2) {
        pagesToDisplay.push(renderEllipsis("ellipsis2"));
      }

      pagesToDisplay.push(renderPaginationButton(pageNumbers.length));

      return pagesToDisplay;
    }
  };

  useEffect(() => {
    fetchFilms();
    fetchGenres();
  }, []);

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(event.target.value);
  };

  useEffect(() => {
    if (films) {
      let filtered = [...films];
      if (selectedGenre) {
        filtered = filtered.filter((film) => film.genre === selectedGenre);
      }
      setFilteredFilms(filtered);
    }
  }, [films, selectedGenre]);

  const handleImageClick = () => {
    setShowInput(true);
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.length >= 3) {
        const results = await searchFilms(searchTerm);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    handleSearch();
  }, [searchTerm]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const getMovieSessions = async (filmTitle: string) => {
    try {
      const response = await axios.get(
        `http://services.cineserie.com/v1/search/movies?q=${encodeURIComponent(
          filmTitle
        )}`
      );

      if (response && response.data && response.data.length > 0) {
        const filmId = response.data[0].id;
        const cineserieUrl = `https://www.cineserie.com/movies/${filmId}/`;
        console.log("L'URL de la page de Cineserie est :", cineserieUrl);
      } else {
        console.error("Aucun film trouvé avec le titre :", filmTitle);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des séances de cinéma :",
        error
      );
    }
  };

  const openFilmModal = (filmId: string) => {
    setSelectedFilmId(filmId);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
    const movieTitle = films.find((film) => film._id === filmId).titre;
    getMovieSessions(movieTitle);
  };

  const closeFilmModal = () => {
    setSelectedFilmId(null);
    setModalOpen(false);
    document.body.style.overflow = "";
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className={`bg-slate-900 ${modalOpen ? "overflow-hidden" : ""}`}>
      <div className="flex items-center justify-between p-3 bg-slate-800 md:p-4 lg:p-5">
        <img
          src="src/images/loginuser1.webp"
          alt="logo"
          className="w-8 h-8 cursor-pointer md:w-10 md:h-10"
          onClick={() => navigate("/dashboard")}
        />
        <div className="flex items-center gap-2 md:gap-4">
          {!showInput && (
            <img
              src="src/images/loupe1.webp"
              alt="logo"
              className="w-8 h-8 cursor-pointer md:w-10 md:h-10"
              onClick={handleImageClick}
            />
          )}
          {showInput && (
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Rechercher un film..."
              className="w-40 p-2 text-sm text-black bg-white rounded-md font-['Montserrat'] md:w-60 lg:w-80"
            />
          )}
          <select
            title="Genre"
            value={selectedGenre}
            onChange={handleGenreChange}
            className="w-24 p-2 text-sm text-white bg-slate-700 rounded-md font-['Montserrat'] md:w-32 lg:w-40"
          >
            <option value="" className="text-black">
              Tous les genres
            </option>
            {genres.map((genre) => (
              <option key={genre} value={genre} className="text-black">
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h1 className="mt-6 mb-8 text-2xl font-extrabold text-center text-white uppercase font-['Montserrat'] md:text-3xl lg:text-4xl">
        La Cinémathèque Française
      </h1>

      <div className="w-full h-full bg-slate-900">
        {searchTerm.length >= 3 && searchResults.length === 0 && (
          <p className="text-center text-white font-['Montserrat']">
            Désolé, aucun titre disponible
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {currentFilms.map((film) => (
          <div className="flex flex-col items-center" key={film._id}>
            <div
              className="relative w-full overflow-hidden transition-transform rounded-lg shadow-lg cursor-pointer hover:scale-105"
              onClick={() => openFilmModal(film._id)}
            >
              <img
                src={
                  film.posterPath
                    ? `https://image.tmdb.org/t/p/w500${film.posterPath}`
                    : "src/images/affiche.webp"
                }
                alt={film.titre}
                className="w-full h-auto"
              />
            </div>
            <div className="flex gap-4 mt-3">
              <img
                src="src/images/love.webp"
                alt="icone love film"
                onClick={() => likeFilm(film._id)}
                className="w-6 h-6 transition-transform cursor-pointer hover:scale-110"
              />
              <img
                src="src/images/watch.webp"
                alt="icone eye film"
                onClick={() => watchFilm(film._id)}
                className="w-6 h-6 transition-transform cursor-pointer hover:scale-110"
              />
              <img
                src="src/images/towatch.webp"
                alt="icone watchlist film"
                onClick={() => watchlistFilm(film._id)}
                className="w-6 h-6 transition-transform cursor-pointer hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>

      <ul className="flex justify-center gap-3 mt-8 mb-8">
        {renderPagination()}
      </ul>

      {selectedFilmId && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 ${
            modalOpen ? "visible" : "hidden"
          }`}
          onClick={closeFilmModal}
        >
          <div
            className="w-11/12 max-h-[90vh] overflow-y-auto bg-slate-800 rounded-xl p-4 md:w-4/5 lg:w-3/4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <div className="w-full aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${
                    films.find((film) => film._id === selectedFilmId)
                      .trailerPath
                  }?autoplay=1&mute=1`}
                  title="Bande annonce"
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white uppercase font-['Montserrat'] md:text-2xl">
                  {films.find((film) => film._id === selectedFilmId).titre}
                </h2>

                <div className="flex flex-wrap gap-3 text-sm text-white font-['Montserrat']">
                  <span>
                    {films.find((film) => film._id === selectedFilmId).duree}
                  </span>
                  <span>
                    {films.find((film) => film._id === selectedFilmId).votePath}
                  </span>
                  <span className="font-bold">
                    {
                      films.find((film) => film._id === selectedFilmId)
                        .annee_de_production
                    }
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-white font-['Montserrat']">
                    <span className="font-semibold">Réalisateurs :</span>{" "}
                    {
                      films.find((film) => film._id === selectedFilmId)
                        .realisateurs
                    }
                  </p>
                  <p className="text-white font-['Montserrat']">
                    <span className="font-semibold">Genre :</span>{" "}
                    {films.find((film) => film._id === selectedFilmId).genre}
                  </p>
                </div>

                <p className="text-white text-justify font-['Montserrat']">
                  {films.find((film) => film._id === selectedFilmId).synopsis}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="mb-4 text-lg font-bold text-white font-['Montserrat']">
                  Séances de cinéma
                </h3>
                <ul className="space-y-2 text-white font-['Montserrat']">
                  {movieSessions.map((session, index) => (
                    <li key={index} className="p-2 rounded-md bg-slate-700">
                      <div className="flex flex-col gap-1">
                        {session.cinema && session.cinema.name ? (
                          <span className="font-semibold">
                            {session.cinema.name}
                          </span>
                        ) : (
                          <span>Cinéma non disponible</span>
                        )}
                        {session.date && session.time ? (
                          <span>
                            {session.date} - {session.time}
                          </span>
                        ) : (
                          <span>Date et heure non disponibles</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
