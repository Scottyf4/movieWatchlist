const displayArea = document.getElementById("displayContainer");
const searchText = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addToWatchlistBtn = document.getElementById("addToWatchlist");
const startupDisplay = document.getElementById("startupDisplay");
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

displayArea.addEventListener("click", (e) => {
  if (e.target.closest(".addMovieBtn")) {
    const button = e.target.closest(".addMovieBtn");
    const movieId = button.id.replace("addToWatchlist", "");

    addToWatch(movieId);
  }
});

// Function to get data from Omdb

function getOmdbData(searchedMovie) {
  try {
    fetch(`https://www.omdbapi.com/?apikey=5f5d0368&s=${searchedMovie}`)
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
    fetch(`https://www.omdbapi.com/?apikey=5f5d0368&i=${id}`)
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
    artwork = `<img class='moviePoster' src='/images/defaultImage.jpg' alt=no image avaliable/>`;
  } else {
    artwork = `<img class='moviePoster' src=${movieData.Poster} alt=movie artwork for ${movieData.Title}/>`;
  }

  displayArea.innerHTML += `
      <div class='movieCard'>
        ${artwork}
        <div>
          <div class='movieTop'>
            <h2 class='movieTitle'>${movieData.Title}</h2>
            <p class='movieRating'>⭐️ ${movieData.imdbRating} </p>
          </div>
          <div class='movieDetails'>
            <p>${movieData.Runtime} </p>
            <p>${movieData.Genre} </p>
            <button class='addMovieBtn' id='addToWatchlist${movieData.imdbID}'>
              <div class='circle'>
                <span class='plus'>+</span>
              </div>
              <span class='btnText'>Watchlist</span>
            </button>
          </div>
          <div class='movieDetails'>
            <p class='moviePlot' id='moviePlot'>${movieData.Plot}</p>
          </div>
        </div>
      </div>
      `;
}

// Function to add movie data to local storage

function addToWatch(movieId) {
  fetch(`https://www.omdbapi.com/?apikey=5f5d0368&i=${movieId}`)
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
