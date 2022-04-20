var currentSearchInput = '';
var currentData = [];

function search() {
   var input = document.getElementById('searchInput');
   var inputValue = input.value;
   //it won't search if the user clicks on the button and the input is empty
   //it won't search if the user clicks on the button and search was already done
   //for both these cases input will be focused
   if (currentSearchInput !== inputValue && inputValue.length) {
      currentSearchInput = inputValue;
      axios.get('http://api.tvmaze.com/search/shows?q='+ inputValue)
          .then(response => {
             currentData = response.data;
             if (response.data.length === 0) {
                alert("No results found!")
             } else {
                displayMovies(currentData);
             }
          })
          .catch(error => console.error(error));
   } else {
      input.focus();
   }   
}

function getCast(event) {
   var movieId = '';
   if (event.target.id) {
      movieId = event.target.id;
   } else {
      movieId = event.target.parentElement.id;
   }
   if(movieId) {
      axios.get('http://api.tvmaze.com/shows/'+movieId+'/cast')
          .then(response => {
             displayMovieDetails(movieId, response.data);
          })
          .catch(error => console.error(error));
   }
}

function popUpControl() {
   var moviePopup = document.getElementById('moviePopup');
   if(!moviePopup.style.display || moviePopup.style.display === "none") {
      moviePopup.style.display = "block";
   } else {
      moviePopup.style.display = "none"
   }
}


function displayMovies(data) {
   var moviesContainer = document.getElementById('moviesContainer');
   moviesContainer.innerHTML = '';
   data.forEach(function (result) {
      
      //movie container creation
      var movieContainer = document.createElement('div');
      movieContainer.className = 'card-container';
      movieContainer.id = result.show.id;
      movieContainer.addEventListener('click', getCast, false);
      
      movieContainer.appendChild(getImageElement(result.show));
      movieContainer.appendChild(getTitleElement(result.show));

      moviesContainer.appendChild(movieContainer);
   })
}

function displayMovieDetails(movieId, cast) {
   popUpControl();
   modalContent.innerHTML = '';
   var movieResult = currentData.find(function (movie) {
      return movie.show && movie.show.id && movie.show.id.toString() === movieId;
   })
   modalContent.appendChild(getTitleElement(movieResult.show));
   modalContent.appendChild(getImageElement(movieResult.show));
   
   //link element
   if (movieResult.show.url) {
      var movieLinkContainer = document.createElement('div');
      var movieLink = document.createElement('a');
      movieLink.innerText = 'Link';
      movieLink.href = movieResult.show.url;
      movieLink.target = '_blank';
      movieLinkContainer.appendChild(movieLink);
      modalContent.appendChild(movieLinkContainer);
   }
   
   //rating element
   if (movieResult.show.rating && movieResult.show.rating.average) {
      var movieRating = document.createElement('p');
      movieRating.innerText = 'Ratting: '+ movieResult.show.rating.average;
      modalContent.appendChild(movieRating);
   }

   //genres element
   if (movieResult.show.genres) {
      var movieGenres = document.createElement('p');
      var allGenres = 'Genres: ';
      movieResult.show.genres.forEach(function (genre) {
         allGenres+= genre+" ";
      })
      movieGenres.innerText = allGenres;
      modalContent.appendChild(movieGenres);
   }

   //description element
   if (movieResult.show['summary']) {
      var movieDescription = document.createElement('p');
      movieDescription.innerHTML = '<h4>Description:</h4>'+ movieResult.show['summary'];
      modalContent.appendChild(movieDescription);
   }
   
   // cast members container
   if (cast && cast.length > 0) {
      var castContainer = document.createElement('div');

      cast.forEach(function (castMember) {
         var castMemberContainer = document.createElement('div');
         castMemberContainer.className = 'card-container';
         castMemberContainer.appendChild(getImageElement(castMember.person));
         castMemberContainer.appendChild(getTitleElement(castMember.person));
         castContainer.appendChild(castMemberContainer);
      })
      modalContent.appendChild(castContainer);
   }
}

//image creation
function getImageElement (data) {
   var movieImage = document.createElement('img');
   movieImage.className = 'card-image';
   if (data && data.image) {
      if (data.image.original) {
         movieImage.src = data.image.original;
      } else {
         movieImage.src = data.image.medium;
      }
   }
   return movieImage;
}

//text creation
function getTitleElement (data) {
   var movieTitle = document.createElement('p');
   movieTitle.className = 'card-text';
   movieTitle.innerText = data.name;

   return movieTitle;
}




