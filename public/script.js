const searchBar = document.getElementById('search-bar');
const searchResults = document.getElementById('search-results');
const displayedArtists = [];

searchBar.addEventListener('input', function() {
    const query = searchBar.value;

    searchResults.innerHTML = '';

    if (query.trim() !== '') {
        performJSONPRequest(query);
    }
});

function performJSONPRequest(query) {
    const callbackName = 'jsonpCallback_' + Date.now();

    window[callbackName] = function(data) {
        displaySearchResults(data);
        delete window[callbackName];
        scriptElement.parentNode.removeChild(scriptElement);
    };

    const scriptElement = document.createElement('script');
    scriptElement.src = `https://itunes.apple.com/search?term=${query}&callback=${callbackName}`;

    document.body.appendChild(scriptElement);
}

function displaySearchResults(data) {
    if (data.results && data.results.length > 0) {
        searchResults.innerHTML = ''; 

        const query = searchBar.value.trim().toLowerCase();

        const matchingArtist = data.results.find(result => {
            const artistName = result.artistName.toLowerCase();
            return artistName === query;
        });

        if (matchingArtist) {
            const artistLink = document.createElement('a');
            artistLink.textContent = matchingArtist.artistName;
            artistLink.href = `detail.html?artist=${encodeURIComponent(matchingArtist.artistName)}`;
            artistLink.addEventListener('click', function(event) {
                event.preventDefault(); 
                window.location.href = artistLink.href; 
            });

            const artistDiv = document.createElement('div');
            artistDiv.appendChild(artistLink);

            searchResults.appendChild(artistDiv);
        } else {
            searchResults.textContent = 'Searching';
        }
    } else {
        searchResults.textContent = 'Please type a filter';
    }
}

