let map;
let service;

const regions = {
    willamette: { lat: 45.2626, lng: -123.0479 },
    napa: { lat: 38.4975, lng: -122.4644 },
    woodinville: { lat: 47.7319, lng: -122.1465 },
    wallawalla: { lat: 46.0336, lng: -118.3654 },
    sonoma: { lat: 38.2547, lng: -122.4495 }
};

async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: regions.willamette,
        zoom: 15,
        mapId: "DEMO_MAP_ID"
    });
    service = new google.maps.places.PlacesService(map);
    updateMap();
}

function updateMap() {
    const selectedRegion = document.getElementById('wine-region').value;
    const { AdvancedMarkerElement, PinElement } = google.maps.importLibrary("marker");
    const center = regions[selectedRegion];
    map.setCenter(center);

    // Search for wineries near the selected region
    // Tried different variations like: vineyard, wine tasting, wineries but
    //  keyword 'winery' and type 'establishment' returned the least false positives
    const request = {
        location: center,
        radius: '5000',
        keyword: 'winery',
        type: ['establishment']
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayWineries(results);
            results.forEach(place => {
                // new google.maps.Marker({
                // new AdvancedMarkerElement({
                new google.maps.marker.AdvancedMarkerElement({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                });
            });
        } else {
            console.error('PlacesServiceStatus:', status);
        }
    });
}


function displayWineries(wineries) {
    const list = document.getElementById('wineries-list');
    list.innerHTML = '<h3>Top Wineries In The Region</h3>';
    wineries.forEach(winery => {
        const listItem = document.createElement('div');
        listItem.textContent = winery.name;
        list.appendChild(listItem);
    });
}
