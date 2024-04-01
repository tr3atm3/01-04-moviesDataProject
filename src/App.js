import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
const dummyMovies = [
  {
    id: 1,
    title: "Some Dummy Movie",
    openingText: "This is the opening text of the movie",
    releaseDate: "2021-05-18",
  },
  {
    id: 2,
    title: "Some Dummy Movie 2",
    openingText: "This is the second opening text of the movie",
    releaseDate: "2021-05-19",
  },
];

function App() {
  const [moviesList, setMoviesList] = useState();
  async function fetchMoviesHandler() {
    try {
      const response = await fetch("https://swapi.dev/api/films");
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
      console.log(err.message);
    }
  }
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={moviesList} />
      </section>
    </React.Fragment>
  );
}

export default App;
