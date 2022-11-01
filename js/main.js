// Search Zone
const elMovieForm = document.querySelector(".js-hero-form");
const elMovieSearch = elMovieForm.querySelector(".js-hero-input");
const elMovieSearchCategorie = elMovieForm.querySelector(".js-hero-select"); 
const elMovieMinYear = elMovieForm.querySelector(".js-hero-min-year");
const elMovieMaxYear = elMovieForm.querySelector(".js-hero-max-year");

const elMovieSort = elMovieForm.querySelector(".js-hero-sort");
// Movies List 
const elMovieList = document.querySelector(".js-mov-list");

// MODAL
const elModal = document.querySelector(".modal");
const modalTitle = elModal.querySelector(".modal-title");
const modalIframe = elModal.querySelector(".modal-iframe");
const modalRating = elModal.querySelector(".modal-rating");
const modalYear = elModal.querySelector(".modal-year");
const modalRuntime = elModal.querySelector(".modal-runtime");
const modalCategories = elModal.querySelector(".modal-categories");
const modalSummary = elModal.querySelector(".modal-summary");
const modalLink = elModal.querySelector(".modal-imdb-link");

function getTime(time){
    const hours = Math.floor(time / 60);
    const minuts = Math.floor(time % 60);

    return `${hours}hrs ${minuts}min`
}

function crateList(movies){

    elMovieList.innerHTML = null;

    const elMovieTemp = document.querySelector(".js-mov-temp").content;
    const elMovieFragment = new DocumentFragment();

    movies.forEach(item => {
        const elCloneMovie = elMovieTemp.cloneNode(true);

        elCloneMovie.querySelector(".js-mov-img").src = `https://i3.ytimg.com/vi/${item.ytid}/mqdefault.jpg`;
        elCloneMovie.querySelector(".js-mov-title").textContent =  item.Title;
        elCloneMovie.querySelector(".js-mov-rating").textContent =  item.imdb_rating;
        elCloneMovie.querySelector(".js-mov-year").textContent =  item.movie_year;
        elCloneMovie.querySelector(".js-mov-runtime").textContent =  getTime(item.runtime);
        elCloneMovie.querySelector(".js-mov-categories").textContent =  item.Categories.split("|").join(", ");
        elCloneMovie.querySelector(".js-mov-btn").dataset.id = item.imdb_id;

        elMovieFragment.appendChild(elCloneMovie)
    });

    elMovieList.appendChild(elMovieFragment)
};

function addGanres(Ganres){
    const arr = [];

    Ganres.forEach(item => {
        item.Categories.split("|").forEach(element => {
            if(!arr.includes(element)){
                arr.push(element);
            };
        });
    });

    const elGanresFrag = new DocumentFragment();

    arr.forEach(item => {
        const Option = document.createElement("option");
        Option.textContent = item;
        Option.value = item;

        elGanresFrag.appendChild(Option);
    });

    elMovieSearchCategorie.appendChild(elGanresFrag)
};

function renderModalInfo(Movie){
    modalTitle.textContent = Movie.Title;
    modalIframe.src = `https://www.youtube-nocookie.com/embed/${Movie.ytid}`;
    modalRating.textContent = Movie.imdb_rating;
    modalYear.textContent = Movie.movie_year;
    modalRuntime.textContent = getTime(Movie.runtime);
    modalCategories.textContent = Movie.Categories.split("|").join(", ");
    modalSummary.textContent = Movie.summary;
    modalLink.href = `https://www.imdb.com/title/${Movie.imdb_id}`;
};

elMovieList.addEventListener("click", function(evt){
    if(evt.target.matches(".js-mov-btn")){
        const btnId = evt.target.dataset.id;
        const foundMovie = movies.find(movie => movie.imdb_id === btnId);
        renderModalInfo(foundMovie);
    }
});

elModal.addEventListener("hide.bs.modal", function(){
    modalIframe.src = "";
});

function sortMovie(Arr, sortValue){
    if(sortValue == "2000-2018"){
        Arr.sort((a, b)=> a.movie_year - b.movie_year)
    }
    else if(sortValue == "2018-2000"){
        Arr.sort((a, b)=> b.movie_year - a.movie_year)
    }

    if(sortValue == "A-Z"){
        Arr.sort((a, b)=> {
            if(a.Title > b.Title){
                return 1
            }
            else if(a.Title < b.Title){
                return -1
            }
            else{
                return 0
            }
        })
    }
    else if(sortValue == "Z-A"){
        Arr.sort((a, b)=>{
            if(String(a.Title) > String(b.Title)){
                return -1
            }
            else if(String(a.Title) < String(b.Title)){
                return 1
            }
            else{
                return 0
            }
        })
    }


    if(sortValue == "1-10"){
        Arr.sort((a, b)=> a.imdb_rating - b.imdb_rating)
    }
    else if(sortValue == "10-1"){
        Arr.sort((a, b)=> b.imdb_rating - a.imdb_rating)
    }
}

elMovieForm.addEventListener("submit", function(evt){
    evt.preventDefault();

    const elInputValue = elMovieSearch.value.trim();
    const elGanresValue = elMovieSearchCategorie.value;
    const elMinYearValue = Number(elMovieMinYear.value);
    const elMaxYearValue = Number(elMovieMaxYear.value);

    const elMovieSortValue = elMovieSort.value;

    sortMovie(movies, elMovieSortValue)

    const regexText = new RegExp(elInputValue, "gi");
    const regexGanres = new RegExp(elGanresValue, "gi");
    if(elInputValue == ""){
        const elSearch = movies.filter(item => (item.Categories.match(regexGanres) || elGanresValue === "All") && ((elMinYearValue <= item.movie_year && elMaxYearValue >= item.movie_year) || (elMinYearValue == "" && elMaxYearValue >= item.movie_year) || (elMinYearValue <= item.movie_year && elMaxYearValue == "")));
        crateList(elSearch.slice(0, 12))
    }
    else{
    
        const elSearch = movies.filter(item => String(item.Title).match(regexText) && (item.Categories.match(regexGanres) || elGanresValue === "All") && ((elMinYearValue <= item.movie_year && elMaxYearValue >= item.movie_year) || (elMinYearValue == "" && elMaxYearValue >= item.movie_year) || (elMinYearValue <= item.movie_year && elMaxYearValue == "")));
    
        if(elSearch.length > 0){
            crateList(elSearch);
        }
        else{
            elMovieList.innerHTML = ""
            const item = document.createElement("li");
            const text = document.createElement("h3");
            text.classList.add("text-white");
            text.textContent = "Not Found"
    
            item.appendChild(text);
            elMovieList.appendChild(item)
        }
    }
})

crateList(movies.slice(0, 12))
addGanres(movies)