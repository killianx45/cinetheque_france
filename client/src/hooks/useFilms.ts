import { useState } from "react";

export const useFilms = () => {
  const [films, setFilms] = useState<any[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFilms = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/films");
      const data = await response.json();
      setFilms(data);
    } catch (error) {
      console.error("Erreur lors du chargement des films:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/films/meta");
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Erreur lors du chargement des genres:", error);
    }
  };

  const searchFilms = async (searchTerm: string) => {
    if (searchTerm.length < 3) return [];

    try {
      const response = await fetch(
        `http://localhost:3000/api/films/search?title=${searchTerm}`
      );
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      return [];
    }
  };

  return {
    films,
    genres,
    loading,
    fetchFilms,
    fetchGenres,
    searchFilms,
  };
};
