document.addEventListener("DOMContentLoaded", function() {
    let geojsonData;

    // Fetch GeoJSON data first
    fetch('/custom.geo.json')
    .then(response => response.json())
    .then(data => {
        geojsonData = data;

            return fetch('cleaned_data.json');
        })
        .then(response => response.json())
        .then(data => {
            populateDropdown(data);

            // Initialize the map
            window.map = L.map('map').setView([0, 0], 2);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Adding counties with colors based on topic
            L.geoJson(geojsonData, {
                style: function(feature) {
                    const county = feature.properties.name;
                    const countyData = data.find(item => item.country === county);
                    return {
                        fillColor: countyData ? getColorForTopic(countyData.topic) : 'gray',
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.7
                    };
                }
            }).addTo(map);
        });

    document.querySelector('.dropbtn').addEventListener('click', function() {
        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
    });

    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropbtn') && !event.target.matches('.dropdown-content a')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                dropdowns[i].style.display = "none";
            }
        }
    });

    let markers = [];

    function populateDropdown(data) {
        const topics = [...new Set(data.map(item => item.topic))];
        const dropdownMenu = document.getElementById('dropdownMenu');
        
        topics.forEach(topic => {
            let link = document.createElement('a');
            link.href = "#";
            link.innerText = topic;
            link.addEventListener('click', function() {
                displayCountryMarkersForTopic(topic, data);
            });
            dropdownMenu.appendChild(link);
        });
    }

    function displayCountryMarkersForTopic(topic, data) {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        const relevantData = data.filter(row => row.topic === topic);

        relevantData.forEach(item => {
            const county = item.country;
            const coords = getCentroidForCounty(county, geojsonData);
            
            if(coords) {
                const marker = L.marker([coords.lat, coords.lng]).addTo(map)
                    .bindPopup(county + ": " + item.index_trends);
                markers.push(marker);
            }
        });
    }

    function getCentroidForCounty(county, geoJson) {
        const feature = geoJson.features.find(f => f.properties.name === county);
        if (feature) {
            const latlngBounds = L.geoJSON(feature).getBounds();
            return latlngBounds.getCenter();
        }
        return null;
    }
});
