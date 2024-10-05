const displayArea = document.getElementById("displayContainer");
const searchBtn = document.getElementById("searchBtn");
const addToWatchlistBtn = document.getElementById("addToWatchlist");
const startupDisplay = document.getElementById("startup-display");
const watchLink = document.getElementById("watchLink");

// Event listeners

if (window.location.pathname.endsWith("index.html")) {
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    startupDisplay.style.display = "none";
    displayArea.innerHTML = "";
    let searchValue = document.getElementById("searchInput").value;
    getOmdbData(searchValue);
  });

  displayArea.addEventListener("click", function (event) {
    if (event.target.closest(".add-movie-btn")) {
      const button = event.target.closest(".add-movie-btn");
      const movieId = button.id.replace("addToWatchlist", "");

      addToWatch(movieId);
    }
  });

  watchLink.addEventListener("click", displayMovies);
}

// Function to get data from Omdb

function getOmdbData(searchedMovie) {
  try {
    fetch(`http://www.omdbapi.com/?apikey=5f5d0368&s=${searchedMovie}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === "True") {
          data.Search.forEach((movie) => {
            getImbdDetails(movie.imdbID);
          });
        } else {
          displayArea.innerHTML = `
        <h2 class='errorDisplay'>${data.Error}. Please try another search.</h2>
        `;
        }
      });
  } catch (err) {
    console.error(err);
  }
}

// function to take base details from OMDb and get extra details using the Imdb ID
function getImbdDetails(id) {
  try {
    fetch(`http://www.omdbapi.com/?apikey=5f5d0368&i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        createMovieCard(data);
      });
  } catch (err) {
    console.error(err);
  }
}
// function to use data from API to create html Card to display
function createMovieCard(movieData) {
  displayArea.innerHTML += `
      <div class='movie-card'>
        <img class='movie-poster' src=${movieData.Poster}/>
        <div>
          <div class='movie-top'>
            <h2 class='movie-title'>${movieData.Title}</h2>
            <p class='movie-rating'>⭐️ ${movieData.imdbRating} </p>
          </div>
          <div class='movie-details'>
            <p>${movieData.Runtime}</p>
            <p>${movieData.Genre}</p>
            <button class='add-movie-btn' id='addToWatchlist${movieData.imdbID}'>
              <div class='circle'>
                <span class='plus'>+</span>
              </div>
              <span class='btn-text'>Watchlist</span>
            </button>
          </div>
          <div class='movie-details'>
            <p class='movie-plot' id='movie-plot'>${movieData.Plot}</p>
          </div>
        </div>
      </div>
      `;
}

// Function to add movie data to local storage

function addToWatch(movieId) {
  console.log(movieId);
  fetch(`http://www.omdbapi.com/?apikey=5f5d0368&i=${movieId}`)
    .then((res) => res.json())
    .then((data) => {
      if (!localStorage.getItem("movies")) {
        localStorage.setItem("movies", JSON.stringify([]));
      }

      const moviesData = localStorage.getItem("movies");
      const moviesArray = JSON.parse(moviesData);

      moviesArray.push(data);
      console.log(moviesArray);
      localStorage.setItem("movies", JSON.stringify(moviesArray));
    });
}

if (window.location.pathname.endsWith("watchlist.html")) {
  const watchlistMovies = document.getElementById("watchlistMovies");

  displayMovies();

  function displayMovies() {
    const storedMovies = localStorage.getItem("movies");
    const moviesStored = JSON.parse(storedMovies);

    if (moviesStored.length === 0) {
      watchlistMovies.innerHTML = `
          <h4>No Movies to display</h4>
        `;
    } else {
      moviesStored.forEach((movie) => {
        watchlistMovies.innerHTML += `
        <div class='movie-card'>
          <img class='movie-poster' src=${movie.Poster}/>
          <div>
            <div class='movie-top'>
              <h2 class='movie-title'>${movie.Title}</h2>
              <p class='movie-rating'>⭐️ ${movie.imdbRating} </p>
            </div>
            <div class='movie-details'>
              <p>${movie.Runtime}</p>
              <p>${movie.Genre}</p>
              <button class='remove-movie-btn' id='removeFromWatchlist${movie.imdbID}'>
                <div class='circle'>
                  <span class='plus'>-</span>
                </div>
                <span class='btn-text'>Remove From Watchlist</span>
              </button>
            </div>
            <div class='movie-details'>
              <p class='movie-plot' id='movie-plot'>${movie.Plot}</p>
            </div>
          </div>
        </div>
        `;
      });
    }
  }

  watchlistMovies.addEventListener("click", function (event) {
    if (event.target.closest(".remove-movie-btn")) {
      const button = event.target.closest(".remove-movie-btn");
      const movieId = button.id.replace("removeFromWatchlist", "");

      removeMovie(movieId);
    }
  });

  function removeMovie(movieId) {
    const localMovies = localStorage.getItem("movies");
    const returnedMovies = JSON.parse(localMovies);

    console.log(returnedMovies);

    const updatedMovies = returnedMovies.filter(
      (movie) => movie.imdbID !== movieId
    );

    console.log(updatedMovies);

    localStorage.setItem("movies", JSON.stringify(updatedMovies));

    displayMovies();
  }
}
