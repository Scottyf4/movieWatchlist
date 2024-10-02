const apiUrl = "http://www.omdbapi.com/?apikey=5f5d0368&";

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchValue = document.getElementById("searchInput").value;
  console.log(searchValue);
  fetch(`http://www.omdbapi.com/?apikey=5f5d0368&s=${searchValue}`)
    .then((res) => res.json())
    .then((data) => console.log(data));
});
