import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import useMovies from "./useMovies";
import useLocalStorageState from "./useLocalStorageState";
import useKey from "./useKey";

/** Average of all Movie in Watch List */
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
/** Average of all Movie in Watch List */

export default function App() {
  const [query, setQuery] = useState("");
  const [isSelectedId, setIsSelectedId] = useState(null);
  /** custom Hooks */
  const { movies, isLoading, isError } = useMovies(query, selectedId);
  /** custom Hooks */
  /** Save to local Storage */
  const [watched, setWatched] = useLocalStorageState();
  /** Save to local Storage */

  /**Id Selection of the movie */
  // const selectedId = (id) =>
  //   setIsSelectedId((select) => (select === id ? null : id));
  function selectedId(id) {
    setIsSelectedId((select) => (select === id ? null : id));
  }
  /**Id Selection of the movie */

  /** Add movie function in watch list */
  const addMovie = (movie) => setWatched((data) => [...data, movie]);
  /** Add movie function in watch list */
  /** Delete function in watchList */
  const deleteMovie = (id) =>
    setWatched((data) => data.filter((curData) => curData.imdbID !== id));

  /** Delete function in watchList */

  /**Checking If Already Rated */
  const checkRated = watched.map((data) => data.imdbID).includes(isSelectedId);
  /**Checking If Already Rated */

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <ResultSearch movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <MovieList movies={movies} selectedId={selectedId} />
          )}
          {isError && <ErrorMessage message={isError} />}
        </Box>
        <Box>
          {isSelectedId ? (
            <MovieDetails
              key={crypto.randomUUID()}
              isSelectedId={isSelectedId}
              setIsSelectedId={setIsSelectedId}
              addMovie={addMovie}
              checkRated={checkRated}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} deleteMovie={deleteMovie} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

/** Loader Handling Error */

function Loader() {
  return <div className="loader"> Loading ...</div>;
}

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <span>⚠️</span>
      {message}
    </div>
  );
}
/** Loader Handling Error */

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  /** useRef */
  const inputEl = useRef(null);
  /**Focus function */
  function focusSearch() {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  }

  useKey("Enter", focusSearch);
  /**Focus function */

  /** useRef */

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl} /** useRef */
    />
  );
}

function ResultSearch({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length === 0 ? "X" : movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className="box">
        <Button
          label={isOpen ? "-" : "+"}
          clickFunct={() => setIsOpen((open) => !open)}
          className="btn-toggle"
        />
        {isOpen && children}
      </div>
    </>
  );
}

function MovieList({ movies, selectedId }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <ListedMovie key={movie.imdbID} movie={movie} selectedId={selectedId} />
      ))}
    </ul>
  );
}

function ListedMovie({ movie, selectedId }) {
  return (
    <li onClick={() => selectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  isSelectedId,
  setIsSelectedId,
  addMovie,
  checkRated,
  watched,
}) {
  const [movieSelected, setMovieSelected] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  /** count Rating Decision using useRef */
  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current = countRef.current + 1;
  }, [userRating]);
  /** count Rating Decision using useRef */

  const {
    Actors: actors,
    Awards: award,
    BoxOffice: boxOffice,
    Director: director,
    Genre: genre,
    Language: language,
    Plot: plot,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Title: title,
    imdbRating,
  } = movieSelected;

  /**if already rated show the userRate */
  const ratings = watched.find(
    (data) => data.imdbID === isSelectedId
  )?.userRating;
  /**if already rated show the userRate */
  /**Adding Data on Add function */
  const addMovieWatch = () => {
    const newMovieDetais = {
      imdbID: isSelectedId,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      title,
      userRating: Number(userRating),
      countClickRef: countRef.current, //refCount
    };
    addMovie(newMovieDetais);
    setIsSelectedId(null);
  };
  /**Adding Data on Add function */

  /**fetching API for ID Movie */

  const movieSelectedDetails = async () => {
    setIsLoading(true);
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=1b6cc179&i=${isSelectedId}`
    );
    const data = await res.json();
    setMovieSelected(data);
    setIsLoading(false);
  };

  useEffect(() => {
    async function Details() {
      movieSelectedDetails();
    }
    Details();
  }, [isSelectedId]);

  /**fetching API for ID Movie */

  /**Effect Changing Title */
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    /**Clean function */
    return function () {
      document.title = "Movie Details";
    };
    /**Clean function */
  }, [title]);
  /**Effect Changing Title */

  /** Effect Keyboard event listener */
  useKey("Escape", setIsSelectedId);
  /** Effect Keyboard event listener */

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Button
            label="&larr;"
            clickFunct={() => setIsSelectedId(null)}
            className="btn-back"
          />
          <header>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>Language: {language}</p>
              <p>
                <span>⭐</span>
                {imdbRating} imdbRating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!checkRated ? (
                <>
                  <StarRating
                    maxRating={10}
                    size="25px"
                    color="limegreen"
                    setRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <Button
                      label="Add in Watch List"
                      className="btn-add"
                      clickFunct={addMovieWatch}
                    />
                  )}
                </>
              ) : (
                <p style={{ textAlign: "center" }}>
                  <strong>Aleardy Been Rated {ratings} ⭐</strong>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by: {director}</p>
            <p>Awards: {award}</p>
            <p>Box Office Hits :{boxOffice}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedMovieList({ watched, deleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <RecentWatched
          movie={movie}
          key={movie.imdbID}
          deleteMovie={deleteMovie}
        />
      ))}
    </ul>
  );
}

function RecentWatched({ movie, deleteMovie }) {
  return (
    <li>
      <Button
        label="&times;"
        className="btn-delete"
        clickFunct={() => deleteMovie(movie.imdbID)}
      />
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}

function Button({ label = "click", clickFunct, className }) {
  return (
    <button className={className} onClick={clickFunct}>
      {label}
    </button>
  );
}
