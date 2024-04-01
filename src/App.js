import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import MovieForm from "./components/MovieForm";

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
      const response = await fetch(
        "https://react-deployment-demo-f24d5-default-rtdb.asia-southeast1.firebasedatabase.app/movie.json"
      );
      if (!response.ok) {
        throw new Error("Something Went Wrong... Retrying");
      }
      const moviesData = await response.json();
      console.log(moviesData);
      const loadedMovies = [];
      for (const key in moviesData) {
        loadedMovies.push({
          id: key,
          title: moviesData[key].title,
          openingText: moviesData[key].text,
          releaseDate: moviesData[key].date,
        });
      }

      setMoviesList(loadedMovies);
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
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const addMovieHandler = async (movieData) => {
    const response = await fetch(
      "https://react-deployment-demo-f24d5-default-rtdb.asia-southeast1.firebasedatabase.app/movie.json",
      {
        method: "POST",
        body: JSON.stringify(movieData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // const data = await response.json();
    fetchMoviesHandler();
  };

  const deleteMovieHandler = async (id) => {
    const response = await fetch(
      `https://react-deployment-demo-f24d5-default-rtdb.asia-southeast1.firebasedatabase.app/movie/${id}.json`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    console.log(data);
    fetchMoviesHandler();
  };

  return (
    <React.Fragment>
      <section>
        <MovieForm onAddMovie={addMovieHandler} />
      </section>
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
          <MoviesList movies={moviesList} onDelete={deleteMovieHandler} />
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
