const displayArea = document.getElementById("displayContainer");
const searchText = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addToWatchlistBtn = document.getElementById("addToWatchlist");
const startupDisplay = document.getElementById("startup-display");
const watchLink = document.getElementById("watchLink");
const modalBox = document.getElementById("modalBox");
const modalMessage = document.getElementById("modalMessage");

// Event listeners for index.html

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

// Function to get data from Omdb

async function getOmdbData(searchedMovie) {
  try {
    await fetch(`https://www.omdbapi.com/?apikey=5f5d0368&s=${searchedMovie}`)
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
async function getImbdDetails(id) {
  try {
    await fetch(`https://www.omdbapi.com/?apikey=5f5d0368&i=${id}`)
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

async function addToWatch(movieId) {
  await fetch(`https://www.omdbapi.com/?apikey=5f5d0368&i=${movieId}`)
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
// Function to display modal showing which movie has been added to watchlist
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
