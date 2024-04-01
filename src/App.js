import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [reTry, setReTry] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    try {
      setIsloading(true);
      setError(null);
      setMoviesList([]);
      const response = await fetch("https://swapi.dev/api/films");
      if (!response.ok) {
        throw new Error("Something Went Wrong... Retrying");
      }
      const moviesData = await response.json();
      const transformedMovies = moviesData.results.map((movie) => {
        return {
          title: movie.title,
          id: movie.episode_id,
          releaseDate: movie.release_date,
          openingText: movie.opening_crawl,
        };
      });
      setMoviesList(transformedMovies);
    } catch (err) {
      setError(err.message);
      if (!reTry) {
        let retrying = setTimeout(() => {
          fetchMoviesHandler();
        }, 5000);
        setReTry(retrying);
      }
    } finally {
      setIsloading(false);
    }
  }, [reTry]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button
          onClick={() => {
            if (reTry) {
              clearTimeout(reTry);
              setReTry(null);
              setError("Retrying Cancelled");
            }
          }}
        >
          Cancel
        </button>
      </section>
      <section>
        {!isLoading && moviesList?.length > 0 && (
          <MoviesList movies={moviesList} />
        )}
        {!isLoading && moviesList?.length === 0 && !error && (
          <p>No Movies Found</p>
        )}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <div className="loader"></div>}
      </section>
    </React.Fragment>
  );
}

export default App;
