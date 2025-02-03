import { useState } from "react";

export const useUserFilms = () => {
  const [likedFilms, setLikedFilms] = useState<any[]>([]);
  const [watchedFilms, setWatchedFilms] = useState<any[]>([]);
  const [watchlistFilms, setWatchlistFilms] = useState<any[]>([]);

  const fetchUserFilms = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const [likedResponse, watchedResponse, watchlistResponse] =
        await Promise.all([
          fetch("http://localhost:3000/api/user/liked-films", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/user/watched-films", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/user/watchlist-films", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const [likedData, watchedData, watchlistData] = await Promise.all([
        likedResponse.json(),
        watchedResponse.json(),
        watchlistResponse.json(),
      ]);

      setLikedFilms(likedData.likedFilms);
      setWatchedFilms(watchedData.watchedFilms);
      setWatchlistFilms(watchlistData.watchlistFilms);
    } catch (error) {
      console.error("Erreur lors du chargement des films utilisateur:", error);
    }
  };

  const handleUnlike = async (filmId: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3000/api/user/dislike`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filmId }),
      });
      await fetchUserFilms();
    } catch (error) {
      console.error("Erreur lors du unlike:", error);
    }
  };

  const handleUnwatch = async (filmId: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3000/api/user/unwatch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filmId }),
      });
      await fetchUserFilms();
    } catch (error) {
      console.error("Erreur lors du unwatch:", error);
    }
  };

  const handleUnwatchlist = async (filmId: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3000/api/user/unwatchlist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filmId }),
      });
      await fetchUserFilms();
    } catch (error) {
      console.error("Erreur lors du unwatchlist:", error);
    }
  };

  const likeFilm = async (filmId: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3000/api/user/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filmId }),
      });
      await fetchUserFilms();
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  };

  const watchFilm = async (filmId: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3000/api/user/watch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filmId }),
      });
      await fetchUserFilms();
    } catch (error) {
      console.error("Erreur lors du watch:", error);
    }
  };

  const watchlistFilm = async (filmId: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3000/api/user/watchlist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filmId }),
      });
      await fetchUserFilms();
    } catch (error) {
      console.error("Erreur lors du watchlist:", error);
    }
  };

  return {
    likedFilms,
    watchedFilms,
    watchlistFilms,
    fetchUserFilms,
    handleUnlike,
    handleUnwatch,
    handleUnwatchlist,
    likeFilm,
    watchFilm,
    watchlistFilm,
  };
};
