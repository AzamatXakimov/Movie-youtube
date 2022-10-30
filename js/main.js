// Search Zone
const elMovieForm = document.querySelector(".js-hero-form");
const elMovieSearch = elMovieForm.querySelector(".js-hero-input");
const elMovieSearchCategorie = elMovieForm.querySelector(".js-hero-select"); 
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

elMovieForm.addEventListener("submit", function(evt){
    evt.preventDefault();

    const elInputValue = elMovieSearch.value.trim();
    const elGanresValue = elMovieSearchCategorie.value;

    
    if(elInputValue == ""){
        crateList(movies.slice(0, 12))
    }
    else{
        const regexText = new RegExp(elInputValue, "gi");
        const regexGanres = new RegExp(elGanresValue, "gi");
    
        const elSearch = movies.filter(item => String(item.Title).match(regexText) && (item.Categories.match(regexGanres) || elGanresValue === "All"));
    
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