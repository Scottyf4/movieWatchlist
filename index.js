const displayArea = document.getElementById("displayContainer");
const searchText = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addToWatchlistBtn = document.getElementById("addToWatchlist");
const startupDisplay = document.getElementById("startup-display");
const watchLink = document.getElementById("watchLink");
const modalBox = document.getElementById("modalBox");
const modalMessage = document.getElementById("modalMessage");

// Event listeners for index.html

if (window.location.pathname.endsWith("index.html")) {
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    startupDisplay.style.display = "none";
    displayArea.innerHTML = "";
    let searchValue = document.getElementById("searchInput").value;
    getOmdbData(searchValue);
    searchText.value = "";
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
  artwork = "";

  if (movieData.Poster === "N/A") {
    artwork = `<img class='movie-poster' src='/images/defaultImage.jpg' alt=no image avaliable/>`;
  } else {
    artwork = `<img class='movie-poster' src=${movieData.Poster} alt=movie artwork for ${movieData.Title}/>`;
  }

  displayArea.innerHTML += `
      <div class='movie-card'>
        ${artwork}
        <div>
          <div class='movie-top'>
            <h2 class='movie-title'>${movieData.Title}</h2>
            <p class='movie-rating'>⭐️ ${movieData.imdbRating} </p>
          </div>
          <div class='movie-details'>
            <p>${movieData.Runtime} </p>
            <p>${movieData.Genre} </p>
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
  fetch(`http://www.omdbapi.com/?apikey=5f5d0368&i=${movieId}`)
    .then((res) => res.json())
    .then((data) => {
      if (!localStorage.getItem("movies")) {
        localStorage.setItem("movies", JSON.stringify([]));
      }

      const moviesData = localStorage.getItem("movies");
      const moviesArray = JSON.parse(moviesData);

      moviesArray.push(data);
      localStorage.setItem("movies", JSON.stringify(moviesArray));

      displayAddedModal(data);
    });
}

function displayAddedModal(movie) {
  const message =
    (modalMessage.textContent = `${movie.Title} has been added to your watchlist`);
  displayArea.style.display = "none";
  setTimeout(() => {
    modalBox.style.display = "block";

    setTimeout(() => {
      modalBox.style.display = "none";
      displayArea.style.display = "grid";
    }, 1500);
  }, 100);
}

if (window.location.pathname.endsWith("watchlist.html")) {
  const watchlistMovies = document.getElementById("watchlistMovies");

  displayMovies();

  function displayMovies() {
    const storedMovies = localStorage.getItem("movies");
    const moviesStored = JSON.parse(storedMovies);

    if (moviesStored.length === 0) {
      watchlistMovies.innerHTML = `
          <section class='emptySection'>
            <img class='magnifyWatchIcon' src='images/largeSearch.png' />
            <h4 class='emptyWatchlist'>No movies to display!</h4>
            <p>Search for movies for your watchlist</p>
          </section>
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
              <p>${movie.Runtime} </p>
              <p>${movie.Genre} </p>
              <button class='remove-movie-btn' id='removeFromWatchlist${movie.imdbID}'>
                <div class='circle'>
                  <span class='plus'>-</span>
                </div>
                <span class='btn-text'>Remove</span>
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

    const updatedMovies = returnedMovies.filter(
      (movie) => movie.imdbID !== movieId
    );

    localStorage.setItem("movies", JSON.stringify(updatedMovies));
    watchlistMovies.innerHTML = "";
    displayMovies();
  }
}
