const displayArea = document.getElementById("displayContainer");

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchValue = document.getElementById("searchInput").value;
  console.log(searchValue);
  fetch(`http://www.omdbapi.com/?apikey=5f5d0368&s=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response === "True") {
        data.Search.forEach((movie) => {
          getImbdDetails(movie.imdbID);
        });
      } else {
        console.log(data);
        displayArea.innerHTML = `
        <h2>${data.Error}</h2>
        `;
      }
    });
});

// function to take base details from OMDb and get extra details using the Imdb ID
function getImbdDetails(id) {
  fetch(`http://www.omdbapi.com/?apikey=5f5d0368&i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayArea.innerHTML += `
        <img src=${data.Poster}/>
      
      `;
    });
}
