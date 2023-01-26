
const BASEURL = "https://rickandmortyapi.com/api/character";
const mainDiv = document.getElementById("container");
const searchButton = document.querySelector('.search__input');
const searchInput = document.querySelector('.form-control');
let currentPage = 1;
let totalPages;
let currentSearchTerm = '';

// Add click event listeners to the "Previous" and "Next" buttons
document.querySelector('.pagination .page-item:first-child a').addEventListener('click', fetchPreviousPage);
document.querySelector('.pagination .page-item:last-child a').addEventListener('click', fetchNextPage);

// Fetch the first page of information
fetchPage(currentPage, currentSearchTerm);


function fetchPage(pages, searchTerm) {
    let url = `${BASEURL}?page=${pages}`;
    if (searchTerm) {
        url += `&name=${searchTerm}`
    }
    fetch(url)
    .then((results) => results.json())
    .then((characters) => {
        console.log(characters)
        // Clear the main div of previous character information
        mainDiv.innerHTML = '';
        if(characters.info.pages){
            totalPages = characters.info.pages;
        }
        if(characters.results.length === 0) {
            // Disable pagination
            document.querySelector('.pagination').style.display = "none";
            // Display message
            const message = document.createElement("p");
            message.textContent = "No results found for this search.";
            mainDiv.appendChild(message);
        } else {
            characters.results.forEach((character) => {
                const div = createCharacterDiv(character);
                mainDiv.appendChild(div);
            });
            updatePagination();
        }
    });
}

function createCharacterDiv(character) {
    const div = document.createElement("div");
    const avatar = document.createElement("img");
    const viewInfoBtn = document.createElement("button");
    viewInfoBtn.classList.add('viewInfoBtn');
    viewInfoBtn.textContent = "View More Info";
    avatar.src = character.image;
    avatar.alt = character.name;
    const name = document.createElement("h3");
    name.textContent = character.name;

    const firstAppearance = document.createElement("p");
    const episodeLink = character.episode[0];
    const episodeArray = episodeLink.split("/");
    const episodeNumber = episodeArray[episodeArray.length - 1];
    firstAppearance.innerHTML = "<strong>First Appearance In Episode: </strong>" + episodeNumber;

    viewInfoBtn.addEventListener("click", () => {
        displayCharacterInfo(character);
    });
    div.append(avatar, name, firstAppearance, viewInfoBtn);
    return div;
}

function displayCharacterInfo(character) {
    document.querySelector(".modal-type").innerHTML = ""
    document.querySelector(".modal-title").textContent = character.name;
    document.querySelector(".modal-status").innerHTML = "<strong>Status: </strong>" + character.status;
    document.querySelector(".modal-gender").innerHTML = "<strong>Gender: </strong>" + character.gender;
    document.querySelector(".modal-origin-name").innerHTML = "<strong>Origin: </strong>" + character.origin.name;
    document.querySelector(".modal-species").innerHTML = "<strong>Species: </strong>" + character.species;
    if (character.type){
        document.querySelector(".modal-type").innerHTML = "<strong>Type: </strong>" + character.type;
    }
    $('#exampleModal').modal('show');
}

function fetchPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchPage(currentPage, currentSearchTerm);
    }
}

function fetchNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchPage(currentPage, currentSearchTerm);
    }
}

function updatePagination() {
    // Disable "Previous" button if on the first page
    if (currentPage === 1) {
        document.querySelector('.pagination .page-item:first-child').classList.add('disabled');
    } else {
        document.querySelector('.pagination .page-item:first-child').classList.remove('disabled');
    }

    // Disable "Next" button if on the last page
    if (currentPage === totalPages) {
        document.querySelector('.pagination .page-item:last-child').classList.add('disabled');
    } else {
        document.querySelector('.pagination .page-item:last-child').classList.remove('disabled');
    }

    // Remove the "active" class from all page links
    const pageLinks = document.querySelectorAll('.pagination .page-item a');
    pageLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add the "active" class to the link for the current page
    const currentPageLink = document.querySelector(`.pagination .page-item a[href="#"]`);
    currentPageLink.classList.add('active');
    currentPageLink.textContent = currentPage;
}

const pageNumbers = document.querySelectorAll('.pagination .page-item:not(:first-child):not(:last-child) a');
pageNumbers.forEach(link => {
    link.addEventListener('click', function() {
        currentPage = link.textContent;
        fetchPage(currentPage, currentSearchTerm);
    });
});

searchButton.addEventListener("click", () => {
    currentSearchTerm = searchInput.value.toLowerCase();
    fetchPage(1, currentSearchTerm);
});

document.querySelector(".close__btn").addEventListener("click", function(){
    $('#exampleModal').modal('hide');
});

document.querySelector(".btn-secondary").addEventListener("click", function(){
    $('#exampleModal').modal('hide');
});

searchInput.addEventListener("keyup", function(event) { //if user hits enter key after typing input in search
    if (event.keyCode === 13) {
        currentSearchTerm = searchInput.value;
        fetchPage(1, currentSearchTerm);
    }
});