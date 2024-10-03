const displayArea = document.getElementById("displayContainer");

const searchBtn = document.getElementById("searchBtn");
const addToWatchlistBtn = document.getElementById("addToWatchlist");
const startupDisplay = document.getElementById("startup-display");
const watchLink = document.getElementById("watchLink");

// Event listener for seaching a movie

if (window.location.pathname === "/index.html") {
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    startupDisplay.style.display = "none";
    displayArea.innerHTML = "";
    let searchValue = document.getElementById("searchInput").value;
    getOmdbData(searchValue);
  });

  displayArea.addEventListener("click", function (event) {
    // Check if the clicked element is a button with the class 'add-movie-btn'
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
}

// function to take base details from OMDb and get extra details using the Imdb ID
function getImbdDetails(id) {
  fetch(`http://www.omdbapi.com/?apikey=5f5d0368&i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      createMovieCard(data);
    });
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
      localStorage.setItem("my-movies", JSON.stringify(data));
    });
}

function displayMovies() {
  const storedMovies = localStorage.getItem("my-movies");

  if (storedMovies) {
    const moviesArray = JSON.parse(storedMovies);
    console.log(moviesArray);
  }
}
