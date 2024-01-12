import { useEffect, useState } from "react";

export default function useMovies(query, callbackFunction) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [movies, setMovies] = useState([]);
  /** fetching API for Search Bar */

  /**Web browser controller */
  const controller = new AbortController();
  /**Web browser controller */

  const searchMovie = async () => {
    try {
      setIsLoading(true);
      setIsError("");
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=1b6cc179&s='${query}'`,
        { signal: controller.signal }
      );

      if (!res.ok) throw new Error("Fetching Data Failed");
      const data = await res.json();
      if (data.Response === "False") throw new Error("Movie Not Found");
      setMovies(data.Search);
      setIsError("");
    } catch (err) {
      if (err.name !== "AbortError") setIsError(err.message);
    } finally {
      setIsLoading(false);
    }

    if (!query.length) {
      setMovies([]);
      setIsError("");
      return;
    }
  };

  useEffect(() => {
    async function Result() {
      callbackFunction?.();
      searchMovie();
    }
    Result();
    // setIsSelectedId(null);
    return function () {
      controller.abort();
    };
  }, [query]);
  /** fetching API for Search Bar*/

  return { movies, isLoading, isError };
}
