// Seperation of concerns for watchlist.html inc functions and event listeners

const watchlistMovies = document.getElementById("watchlistMovies");

displayMovies();
// function to display movies on watchlist page from local storage
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
// eventlisteners to remove movie from watchlist
watchlistMovies.addEventListener("click", function (event) {
  if (event.target.closest(".remove-movie-btn")) {
    const button = event.target.closest(".remove-movie-btn");
    const movieId = button.id.replace("removeFromWatchlist", "");

    removeMovie(movieId);
  }
});
// function to remove movie from watchlist and local storage
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
